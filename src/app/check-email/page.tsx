import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <MailCheck className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-slate-800">
            Check your inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-600">
          <p>
            We've sent a verification link to your email address. Please click the link to complete your registration and log in.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            You can close this window.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
