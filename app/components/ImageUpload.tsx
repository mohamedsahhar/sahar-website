"use client";

import { useRef } from "react";

export default function ImageUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sahar_upload");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dft7jsjdv/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    onUpload(data.secure_url);
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