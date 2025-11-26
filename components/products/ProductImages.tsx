"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Star, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function ProductImages() {
  const { control, watch, setValue } = useFormContext<CreateProductInput>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "images",
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (!newImageUrl) return;

    append({
      url: newImageUrl,
      alt: "",
      position: fields.length,
      isPrimary: fields.length === 0, // First image is primary by default
    });
    setNewImageUrl("");
  };

  const setPrimary = (index: number) => {
    fields.forEach((field, i) => {
      setValue(`images.${i}.isPrimary`, i === index);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Image URL (https://...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <Button type="button" onClick={handleAddImage} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-2 p-2 border rounded-md bg-card"
            >
              <div className="cursor-move text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="h-12 w-12 relative rounded overflow-hidden border bg-muted">
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
                      <Input
                        placeholder="Alt text"
                        {...field}
                        className="h-8"
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
                      "h-8 w-8",
                      field.value && "bg-yellow-500 hover:bg-yellow-600"
                    )}
                    onClick={() => {
                      // Set the clicked image as primary and unset all others
                      fields.forEach((_, i) => {
                        setValue(`images.${i}.isPrimary`, i === index);
                      });
                    }}
                    title="Set as Primary"
                  >
                    <Star
                      className={cn("h-4 w-4", field.value ? "fill-white" : "")}
                    />
                  </Button>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No images added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
