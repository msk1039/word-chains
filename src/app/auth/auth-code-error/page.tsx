import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error;
  
  // Determine error message based on error type
  let errorTitle = "Authentication Error";
  let errorMessage = "There was a problem verifying your email.";
  let errorDetails = "The link may have expired or already been used.";
  
  if (error === "link_expired" || error?.includes("not found") || error?.includes("already been used")) {
    errorTitle = "Email Link Expired";
    errorMessage = "This verification link has already been used or has expired.";
    errorDetails = "Email links can only be used once and expire after 24 hours.";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 to-fuchsia-50 p-4">
      <Card className="w-full max-w-md border-2 border-pink-200 bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <AlertTriangle className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-pink-900">
            {errorTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-pink-800 font-medium">{errorMessage}</p>
            <p className="text-sm text-pink-700">{errorDetails}</p>
          </div>

          {error === "link_expired" || error?.includes("not found") || error?.includes("already been used") ? (
            <div className="rounded-lg border border-pink-200 bg-pink-50 p-4 text-sm text-pink-800">
              <p className="font-semibold mb-2 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                What to do next:
              </p>
              <ol className="text-left space-y-1 ml-6 list-decimal">
                <li>Check if you're already logged in (try the home page)</li>
                <li>If not, go to the login page and request a new verification email</li>
                <li>Make sure to click the link only once</li>
                <li>Use the link within 24 hours of receiving it</li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-pink-700">
              {error || "Please try again or contact support if the problem persists."}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <RefreshCw className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
