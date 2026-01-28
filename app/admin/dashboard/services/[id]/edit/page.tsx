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

  // Convert Date objects to ISO strings for the form
  const serviceForForm = {
    ...service,
    images:
      service.images?.map((img) => ({
        ...img,
        createdAt:
          img.createdAt instanceof Date
            ? img.createdAt.toISOString()
            : img.createdAt,
      })) || [],
  };

  return (
    <div className="p-6">
      <ServiceForm initialData={serviceForForm} />
    </div>
  );
}
