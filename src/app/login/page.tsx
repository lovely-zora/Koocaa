import { LoginForm } from "@/components/forms/login-form";
import { Laptop } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E40AF] text-white shadow-lg">
            <Laptop className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back to Koocaa</h1>
          <p className="text-sm text-gray-500">Enter your credentials to access your organization</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-gray-400">
          Enterprise Asset Management & Optimization
        </p>
      </div>
    </div>
  );
}
