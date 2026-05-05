"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-square max-h-[560px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
        No product image
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-square max-h-[560px] bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
          aria-label={`Open ${title} image`}
        >
          <Image
            src={selectedImage}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-3 sm:p-5"
          />
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.slice(0, 6).map((image, index) => {
              const isSelected = image === selectedImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square rounded-lg overflow-hidden border bg-white flex items-center justify-center transition ${
                    isSelected
                      ? "border-gray-950 ring-2 ring-gray-950/10"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  aria-label={`View ${title} image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${title} image ${index + 1}`}
                    fill
                    sizes="(min-width: 640px) 96px, 25vw"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[70] bg-black/85 p-4 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          aria-label="Close product image"
        >
          <Image
            src={selectedImage}
            alt={title}
            width={1200}
            height={900}
            sizes="100vw"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </button>
      )}
    </>
  );
}
