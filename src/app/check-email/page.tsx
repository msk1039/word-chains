import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, AlertCircle } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 to-fuchsia-50 p-4">
      <Card className="w-full max-w-md border-2 border-pink-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <MailCheck className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-pink-900">
            Check your inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-pink-800">
            We've sent a verification link to your email address. Please click the link to complete your registration and log in.
          </p>
          
          <div className="rounded-lg border border-pink-200 bg-pink-50 p-4 text-left">
            <p className="flex items-start gap-2 text-sm font-semibold text-pink-900 mb-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              Important:
            </p>
            <ul className="text-sm text-pink-800 space-y-1 ml-6 list-disc">
              <li>Click the verification link <strong>only once</strong></li>
              <li>The link expires in <strong>24 hours</strong></li>
              <li>Don't refresh or close the email tab after clicking</li>
              <li>Check your spam folder if you don't see the email</li>
            </ul>
          </div>

          <p className="text-sm text-pink-600">
            You can close this window after clicking the link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
