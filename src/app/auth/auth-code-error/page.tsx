import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md bg-rose-50 border-rose-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-rose-800">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-rose-700">
          <p>
            There was a problem verifying your email. The link may have expired or already been used.
          </p>
          <p className="mt-4">
            Please try signing in again. If the problem persists, you can try to register again.
          </p>
          <Link href="/login" className="mt-6 inline-block rounded-md bg-slate-800 px-6 py-2 text-white font-semibold hover:bg-slate-700">
            Return to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
