import { getServiceAction } from "@/app/actions/serviceActions";
import { ServiceForm } from "@/components/admin/service-form";
import { notFound } from "next/navigation";


interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const result = await getServiceAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const service = result.data;

  return (
    <div className="p-6">
      <ServiceForm initialData={service} />
    </div>
  );
}
