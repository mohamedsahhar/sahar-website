"use client";

import { useRef, useState } from "react";

export default function ImageUpload({ onUpload, slug }: {
  onUpload: (url: string) => void;
  slug?: string;
  existingImages?: string[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    const usesSlugNaming = slug !== undefined;
    const cleanSlug = slug?.trim();
    if (usesSlugNaming && !cleanSlug) {
      alert("Enter the repair title first so the image can use the same URL name.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (cleanSlug) formData.append("slug", cleanSlug);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onUpload(data.url);
        return;
      }
      alert(data.error || "Image upload failed");
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="bg-black text-white px-3 py-1 rounded disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          e.target.value = "";
        }}
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
      />
    </div>
  );
}
