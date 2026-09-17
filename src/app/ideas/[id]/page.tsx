import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { serializeIdea } from "@/lib/serialize-idea";
import { IdeaDetail } from "@/components/idea-detail";
import type { IdeaDTO } from "@/lib/types";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const idea = await prisma.idea.findFirst({ where: { id, userId: user.id } });
  if (!idea) notFound();

  const dto: IdeaDTO = JSON.parse(JSON.stringify(serializeIdea(idea)));

  return <IdeaDetail idea={dto} />;
}
