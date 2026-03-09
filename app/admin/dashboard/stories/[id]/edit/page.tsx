import { getStoryAction } from "@/app/actions/storyActions";
import { StoryForm } from "@/components/admin/story-form";
import { notFound } from "next/navigation";

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;
  const result = await getStoryAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <StoryForm initialData={result.data} />;
}
