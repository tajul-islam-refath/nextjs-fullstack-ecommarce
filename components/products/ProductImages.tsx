"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProductInput } from "@/lib/validations/product";
import { cn } from "@/lib/utils";
import {
  ImageUploadModal,
  type UploadedFile,
} from "@/components/ui/image-upload-modal";

export function ProductImages() {
  const { control, watch, setValue } = useFormContext<CreateProductInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadSuccess = (uploadedFiles: UploadedFile[]) => {
    uploadedFiles.forEach((file) => {
      append({
        url: file.url,
        alt: file.originalName.replace(/\.[^/.]+$/, ""), // filename without extension
        position: fields.length,
        isPrimary: fields.length === 0, // First image is primary by default
      });
    });
  };

  const setPrimary = (index: number) => {
    fields.forEach((_, i) => {
      setValue(`images.${i}.isPrimary`, i === index);
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setUploadModalOpen(true)}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 p-2 border rounded-md bg-card"
              >
                <div className="h-12 w-12 relative rounded overflow-hidden border bg-muted shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watch(`images.${index}.url`)}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>

                <FormField
                  control={control}
                  name={`images.${index}.url`}
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <FormField
                  control={control}
                  name={`images.${index}.alt`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <input
                          placeholder="Alt text"
                          {...field}
                          className="h-8 w-full px-3 py-1 text-sm border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`images.${index}.isPrimary`}
                  render={({ field }) => (
                    <Button
                      type="button"
                      variant={field.value ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 shrink-0",
                        field.value && "bg-yellow-500 hover:bg-yellow-600"
                      )}
                      onClick={() => setPrimary(index)}
                      title="Set as Primary"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          field.value ? "fill-white" : ""
                        )}
                      />
                    </Button>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No images added yet. Click the button above to upload images.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ImageUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={handleUploadSuccess}
        maxFiles={10}
        maxFileSize={5 * 1024 * 1024} // 5MB
        acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
        title="Upload Product Images"
        description="Upload high-quality images of your product"
      />
    </>
  );
}
