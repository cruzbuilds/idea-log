import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/ideas");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Your ideas stay private to you.</p>
      <Card className="mt-6 p-6">
        <AuthForm mode="register" />
      </Card>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
