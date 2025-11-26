import { BannerForm } from "@/components/banners/BannerForm";

export const metadata = {
  title: "Create Banner | Admin Dashboard",
  description: "Add a new promotional banner",
};

export default function CreateBannerPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create Banner</h1>
        <p className="text-slate-600 mt-1">Add a new banner to your store.</p>
      </div>

      <BannerForm />
    </div>
  );
}
