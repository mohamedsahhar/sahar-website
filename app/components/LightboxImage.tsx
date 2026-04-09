"use client";

import { useState } from "react";

export default function LightboxImage({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* THUMBNAIL */}
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded hover:opacity-80 transition"
      />

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded"
          />
        </div>
      )}
    </>
  );
}