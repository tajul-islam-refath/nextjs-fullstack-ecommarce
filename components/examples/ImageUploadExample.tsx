"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ImageUploadModal,
  type UploadedFile,
} from "@/components/ui/image-upload-modal";

/**
 * Example usage of the ImageUploadModal component
 *
 * This demonstrates different configurations:
 * 1. Single image upload
 * 2. Multiple image upload
 * 3. Custom validation
 * 4. Custom file size and type restrictions
 */

export function ImageUploadExample() {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Example 1: Single image upload
  const handleSingleUpload = (files: UploadedFile[]) => {
    console.log("Uploaded file:", files[0]);
    setUploadedFiles(files);
  };

  // Example 2: Multiple image upload
  const handleMultipleUpload = (files: UploadedFile[]) => {
    console.log("Uploaded files:", files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Example 3: Custom validation
  const customValidation = (file: File): string | null => {
    // Example: Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          resolve("Image must be at least 800x600 pixels");
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve("Invalid image file");
      img.src = URL.createObjectURL(file);
    }) as any;
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Image Upload Examples</h2>

      {/* Example 1: Single Upload */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Single Image Upload</h3>
        <Button onClick={() => setModalOpen(true)}>Upload Single Image</Button>
        <ImageUploadModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={handleSingleUpload}
          maxFiles={1}
          maxFileSize={2 * 1024 * 1024} // 2MB
          acceptedFileTypes={["image/jpeg", "image/png"]}
        />
      </div>

      {/* Example 2: Multiple Upload */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Multiple Image Upload</h3>
        <ImageUploadModal
          open={false}
          onOpenChange={() => {}}
          onSuccess={handleMultipleUpload}
          maxFiles={5}
          maxFileSize={5 * 1024 * 1024} // 5MB
          acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
          title="Upload Multiple Images"
          description="Select up to 5 images"
        />
      </div>

      {/* Example 3: With Custom Validation */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">With Custom Validation</h3>
        <ImageUploadModal
          open={false}
          onOpenChange={() => {}}
          onSuccess={handleMultipleUpload}
          maxFiles={3}
          customValidation={customValidation}
          title="Upload High-Quality Images"
          description="Images must be at least 800x600 pixels"
        />
      </div>

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Uploaded Files</h3>
          <div className="grid grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border rounded-lg p-2">
                <img
                  src={file.url}
                  alt={file.originalName}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs mt-2 truncate">{file.originalName}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
