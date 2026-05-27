"use client";

import { useRef } from "react";

function getCloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/upload/");
    if (parts.length < 2) return "";

    const pathAfterUpload = parts[1].replace(/^v\d+\//, "");
    return pathAfterUpload.replace(/\.[^.]+$/, "");
  } catch {
    return "";
  }
}

function getNextImageNumber(slug: string, images: string[]) {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`(?:^|/)${escapedSlug}-(\\d+)$`);
  const highestSlugNumber = images.reduce((highest, image) => {
    const publicId = getCloudinaryPublicId(image);
    const match = publicId.match(matcher);
    if (!match) return highest;

    return Math.max(highest, Number(match[1]));
  }, 0);

  return Math.max(images.length, highestSlugNumber) + 1;
}

export default function ImageUpload({
  onUpload,
  slug,
  existingImages = [],
}: {
  onUpload: (url: string) => void;
  slug?: string;
  existingImages?: string[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const usesSlugNaming = slug !== undefined;
    const cleanSlug = slug?.trim();
    if (usesSlugNaming && !cleanSlug) {
      alert("Enter a product title first so the image can use the product slug.");
      return;
    }

    const startNumber = cleanSlug
      ? getNextImageNumber(cleanSlug, existingImages)
      : 0;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "sahar_upload");

      if (cleanSlug) {
        formData.append("public_id", `${cleanSlug}-${startNumber + attempt}`);
      }

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dft7jsjdv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok && data.secure_url) {
        onUpload(data.secure_url);
        return;
      }

      const uploadError = data.error?.message || "";
      const nameConflict =
        res.status === 409 || uploadError.toLowerCase().includes("already exists");

      if (!cleanSlug || !nameConflict) {
        alert(data.error?.message || "Image upload failed");
        return;
      }
    }

    alert("Image upload failed: no available filename found");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="bg-black text-white px-3 py-1 rounded"
      >
        Upload Image
      </button>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
