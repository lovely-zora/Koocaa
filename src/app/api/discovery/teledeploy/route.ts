import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Agents poll this to see if the Admin has assigned them a script to run
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const computerName = searchParams.get("computerName");

    if (!computerName) {
      return NextResponse.json({ error: "Missing computerName parameter" }, { status: 400 });
    }

    // Find the asset ID matching this computer name
    const asset = await prisma.asset.findUnique({
      where: { assetTag: `SYS-${computerName.toUpperCase()}` }
    });

    if (!asset) {
      return NextResponse.json({ tasks: [] }); // Device not registered yet
    }

    // Look for any PENDING tasks assigned to this specific machine
    const pendingTask = await prisma.teledeployTask.findFirst({
      where: {
        assetId: asset.id,
        status: "PENDING"
      },
      include: {
        package: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!pendingTask) {
      return NextResponse.json({ tasks: [] });
    }

    // Mark the task as SENT so it doesn't execute repeatedly
    await prisma.teledeployTask.update({
      where: { id: pendingTask.id },
      data: { status: "SENT" }
    });

    return NextResponse.json({
      tasks: [{
        taskId: pendingTask.id,
        command: pendingTask.package.command,
        scriptType: pendingTask.package.scriptType
      }]
    });

  } catch (error: any) {
    console.error("Teledeploy GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. POST: Agents use this to send back execution logs (Success or Failures)
export async function POST(req: Request) {
  try {
    const { taskId, status, resultLog } = await req.json();

    if (!taskId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the task state with the real execution logs from the endpoint machine
    const updatedTask = await prisma.teledeployTask.update({
      where: { id: taskId },
      data: {
        status: status, // "SUCCESS" or "FAILED"
        resultLog: resultLog,
        updatedAt: new Date()
      },
      include: {
        package: true
      }
    });

    // Also write a permanent log to the main Asset History Timeline!
    await prisma.assetHistory.create({
      data: {
        assetId: updatedTask.assetId,
        action: status === "SUCCESS" ? "DEPLOY_SUCCESS" : "DEPLOY_FAILED",
        notes: `Teledeploy Package [${updatedTask.package.name}] executed. Status: ${status}.`
      }
    });

    return NextResponse.json({ success: true, message: "Log recorded successfully." });

  } catch (error: any) {
    console.error("Teledeploy POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
