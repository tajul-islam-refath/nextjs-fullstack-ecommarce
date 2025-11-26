"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createBannerSchema,
  updateBannerSchema,
  type CreateBannerInput,
  type UpdateBannerInput,
} from "@/lib/validations/banner";
import { createBannerAction, updateBannerAction } from "@/lib/actions/banner";
import {
  ImageUploadModal,
  type UploadedFile,
} from "@/components/ui/image-upload-modal";
import { Banner } from "@/app/generated/prisma/client";

interface BannerFormProps {
  initialData?: Banner;
  mode?: "create" | "edit";
}

export function BannerForm({ initialData, mode = "create" }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const isEditMode = mode === "edit";

  const form = useForm<CreateBannerInput | UpdateBannerInput>({
    resolver: zodResolver(isEditMode ? updateBannerSchema : createBannerSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
      linkUrl: initialData?.linkUrl || undefined,
      position: initialData?.position || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleUploadSuccess = (uploadedFiles: UploadedFile[]) => {
    if (uploadedFiles.length > 0) {
      form.setValue("imageUrl", uploadedFiles[0].url);
      form.clearErrors("imageUrl");
    }
  };

  async function onSubmit(data: CreateBannerInput | UpdateBannerInput) {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && initialData) {
        result = await updateBannerAction(initialData.id, data);
      } else {
        result = await createBannerAction(data as CreateBannerInput);
      }

      if (result.success) {
        toast.success(
          isEditMode
            ? "Banner updated successfully"
            : "Banner created successfully"
        );
        router.push("/admin/banners");
        router.refresh();
      } else {
        toast.error(
          result.error ||
            (isEditMode ? "Failed to update banner" : "Failed to create banner")
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {field.value ? (
                              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-100">
                                <img
                                  src={field.value}
                                  alt="Banner preview"
                                  className="h-full w-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-2 top-2"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                onClick={() => setUploadModalOpen(true)}
                                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-slate-50 hover:bg-slate-100"
                              >
                                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                                <p className="text-sm text-slate-500">
                                  Click to upload banner image
                                </p>
                              </div>
                            )}
                            <input type="hidden" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/promo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Where the banner should link to when clicked
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            This banner will be visible on the site
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position / Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Update Banner" : "Create Banner"}
            </Button>
          </div>
        </form>
      </Form>

      <ImageUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={handleUploadSuccess}
        maxFiles={1}
        maxFileSize={5 * 1024 * 1024} // 5MB
        acceptedFileTypes={[
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ]}
        title="Upload Banner Image"
        description="Upload a high-quality banner image"
      />
    </>
  );
}
