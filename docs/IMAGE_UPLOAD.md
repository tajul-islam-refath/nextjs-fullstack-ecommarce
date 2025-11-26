# Image Upload System Documentation

## Overview

A comprehensive, reusable image upload system with drag-and-drop functionality, file validation, and progress tracking.

## Components

### 1. ImageUploadModal

A modal component for uploading images with extensive customization options.

#### Props

| Prop                | Type                              | Default                                                  | Description                            |
| ------------------- | --------------------------------- | -------------------------------------------------------- | -------------------------------------- |
| `open`              | `boolean`                         | -                                                        | Controls modal visibility              |
| `onOpenChange`      | `(open: boolean) => void`         | -                                                        | Callback when modal open state changes |
| `onSuccess`         | `(files: UploadedFile[]) => void` | -                                                        | Callback when upload succeeds          |
| `maxFileSize`       | `number`                          | `5242880` (5MB)                                          | Maximum file size in bytes             |
| `maxFiles`          | `number`                          | `1`                                                      | Maximum number of files to upload      |
| `acceptedFileTypes` | `string[]`                        | `['image/jpeg', 'image/png', 'image/webp', 'image/gif']` | Accepted MIME types                    |
| `customValidation`  | `(file: File) => string \| null`  | -                                                        | Custom validation function             |
| `title`             | `string`                          | `'Upload Images'`                                        | Modal title                            |
| `description`       | `string`                          | `'Drag and drop...'`                                     | Modal description                      |

#### UploadedFile Interface

```typescript
interface UploadedFile {
  originalName: string; // Original filename
  filename: string; // Unique filename on server
  path: string; // Full file path on server
  url: string; // Public URL to access the file
  size: number; // File size in bytes
  type: string; // MIME type
}
```

## API Endpoint

### POST /api/upload

Uploads files to the server's `public/uploads` directory.

#### Request

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: FormData with files under the key `files`

#### Response

**Success (200)**:

```json
{
  "success": true,
  "files": [
    {
      "originalName": "product.jpg",
      "filename": "product-1234567890-abc123.jpg",
      "path": "/path/to/public/uploads/product-1234567890-abc123.jpg",
      "url": "/uploads/product-1234567890-abc123.jpg",
      "size": 123456,
      "type": "image/jpeg"
    }
  ]
}
```

**Error (400/500)**:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Usage Examples

### Example 1: Single Image Upload

```tsx
import { useState } from "react";
import {
  ImageUploadModal,
  UploadedFile,
} from "@/components/ui/image-upload-modal";

function MyComponent() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSuccess = (files: UploadedFile[]) => {
    console.log("Uploaded:", files[0].url);
    // Use the file URL in your application
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Upload Image</button>

      <ImageUploadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
        maxFiles={1}
        maxFileSize={2 * 1024 * 1024} // 2MB
      />
    </>
  );
}
```

### Example 2: Multiple Images Upload

```tsx
<ImageUploadModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onSuccess={(files) => {
    files.forEach((file) => {
      console.log("Uploaded:", file.url);
    });
  }}
  maxFiles={10}
  maxFileSize={5 * 1024 * 1024} // 5MB
  title="Upload Product Images"
  description="Select up to 10 images for your product"
/>
```

### Example 3: Custom Validation

```tsx
const validateImageDimensions = (file: File): string | null => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 600) {
        resolve("Image must be at least 800x600 pixels");
      } else {
        resolve(null);
      }
    };
    img.src = URL.createObjectURL(file);
  }) as any;
};

<ImageUploadModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onSuccess={handleSuccess}
  customValidation={validateImageDimensions}
/>;
```

### Example 4: Specific File Types

```tsx
<ImageUploadModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onSuccess={handleSuccess}
  acceptedFileTypes={["image/png", "image/webp"]}
  maxFileSize={10 * 1024 * 1024} // 10MB
/>
```

## Features

✅ **Drag and Drop**: Intuitive drag-and-drop interface
✅ **File Validation**: Size, type, and custom validation
✅ **Multiple Files**: Support for single or multiple file uploads
✅ **Progress Tracking**: Visual upload progress indicator
✅ **Preview**: Thumbnail previews of selected files
✅ **Error Handling**: Comprehensive error messages
✅ **Responsive**: Works on all screen sizes
✅ **Accessible**: Keyboard navigation and screen reader support

## File Storage

Files are stored in `public/uploads/` with unique filenames:

- Format: `{sanitized-name}-{timestamp}-{random}.{ext}`
- Example: `product-image-1234567890-abc123.jpg`

## Security Considerations

1. **File Type Validation**: Only allowed MIME types are accepted
2. **File Size Limits**: Configurable maximum file size
3. **Filename Sanitization**: Special characters are removed
4. **Unique Filenames**: Prevents file overwrites

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Dependencies

- `react-hook-form`: Form state management
- `lucide-react`: Icons
- `sonner`: Toast notifications
- `@radix-ui/react-dialog`: Modal component

## Troubleshooting

### Files not uploading

1. Check that the `/api/upload` endpoint is accessible
2. Verify file size is within limits
3. Ensure file type is in `acceptedFileTypes`
4. Check browser console for errors

### Images not displaying

1. Verify the `public/uploads` directory exists
2. Check file permissions
3. Ensure Next.js is serving static files correctly

## Future Enhancements

- [ ] Image cropping/editing
- [ ] Cloud storage integration (S3, Cloudinary)
- [ ] Image optimization/compression
- [ ] Batch operations
- [ ] Folder organization
