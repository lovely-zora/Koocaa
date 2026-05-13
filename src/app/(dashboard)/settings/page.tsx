import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganization } from "@/server/actions/organization";
import { Building2, Save, Globe, Landmark } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const org = await prisma.organization.findUnique({
    where: { id: session?.user?.orgId }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Organization Settings</h1>
        <p className="text-muted-foreground">Define your corporate identity and default financial rules.</p>
      </div>

      <form action={updateOrganization} className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1E40AF]" />
              <CardTitle>Company Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input name="name" defaultValue={org?.name || ''} required />
              </div>
              <div className="space-y-2">
                <Label>Base Currency (ISO)</Label>
                <Input name="currency" defaultValue={org?.currency || 'USD'} maxLength={3} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Headquarters Address</Label>
              <Input name="address" defaultValue={org?.address || ''} placeholder="e.g. 123 Enterprise Way, Suite 500" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1e3a8a] px-8">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
