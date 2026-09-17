import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/ideas");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-1 text-sm text-muted">Welcome back.</p>
      <Card className="mt-6 p-6">
        <AuthForm mode="login" />
      </Card>
      <p className="mt-4 text-center text-sm text-muted">
        No account?{" "}
        <Link href="/register" className="font-medium text-accent">
          Sign up
        </Link>
      </p>
    </div>
  );
}
