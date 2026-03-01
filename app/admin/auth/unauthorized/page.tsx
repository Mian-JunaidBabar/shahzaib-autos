import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-destructive/10 p-6 rounded-full inline-block mx-auto mb-4">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404 - Unauthorized
        </h1>

        <p className="text-xl text-muted-foreground">
          Oops! It looks like you don&apos;t have permission to access the admin
          dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/auth/login">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
