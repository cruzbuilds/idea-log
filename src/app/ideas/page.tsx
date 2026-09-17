import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { serializeIdea } from "@/lib/serialize-idea";
import { IdeasDashboard } from "@/components/ideas-dashboard";
import type { IdeaDTO } from "@/lib/types";

export default async function IdeasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const ideas = await prisma.idea.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const ranked = ideas
    .map(serializeIdea)
    .sort((a, b) => b.totalScore - a.totalScore);

  // Round-trip through JSON so the shape matches the API exactly (Date -> ISO string).
  const initialIdeas: IdeaDTO[] = JSON.parse(JSON.stringify(ranked));

  return <IdeasDashboard initialIdeas={initialIdeas} />;
}
