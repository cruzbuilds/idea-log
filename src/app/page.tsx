import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/ideas");

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="mb-4 text-sm font-medium text-accent">For builders</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Score your ideas before you build them.{" "}
        <span className="text-muted">Then find out if you were right.</span>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        Log every idea and rate it on differentiation, evidence, cost, and
        reversibility. When you finish or abandon it, record what actually
        happened and score it again — so your predictions get sharper over
        time.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Start logging ideas
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface-hover"
        >
          Log in
        </Link>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Score on four dimensions",
            body: "Differentiation, evidence, cost, and reversibility — 1 to 5 each, ranked by total.",
          },
          {
            title: "Private by default",
            body: "Your ideas live behind an account. No one sees them unless you share a link.",
          },
          {
            title: "Share one idea, no signup",
            body: "Send a single idea by link. The recipient sees it without creating an account.",
          },
          {
            title: "Track your hindsight",
            body: "Re-score after the fact and see exactly where your predictions were off.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
