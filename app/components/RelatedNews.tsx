"use client"

import { useState, useRef } from "react"

type NewsItem = {
  type: "video"
  src: string
  thumbnail: string
  title: string
}

const newsItems: NewsItem[] = [
  {
    type: "video",
    src: "/news/video-a.mp4",
    thumbnail: "/news/thumb-a.jpg",
    title: "How We Fix JBL Charging Issues",
  },
  {
    type: "video",
    src: "/news/video-b.mp4",
    thumbnail: "/news/thumb-b.jpg",
    title: "Real Charging Port Repair (Before & After)",
  },
  {
    type: "video",
    src: "/news/video-c.mp4",
    thumbnail: "/news/thumb-c.jpg",
    title: "Inside Sa7ar Quick Care Workshop",
  },
]

export default function RelatedNews() {
  const [activeItem, setActiveItem] = useState<NewsItem | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  return (
    <section className="py-24 md:py-28 bg-white text-center px-4 md:px-10">

      <h2 className="text-3xl font-bold text-gray-900">
        Inside Sa7ar Quick Care
      </h2>

      <p className="text-gray-600 mt-3">
        Real moments from our repair work and workshop
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">

        {newsItems.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer border rounded-xl overflow-hidden group"
            onClick={() => setActiveItem(item)}
            onMouseEnter={() => videoRefs.current[index]?.play()}
            onMouseLeave={() => {
              const v = videoRefs.current[index]
              if (v) {
                v.pause()
                v.currentTime = 0
              }
            }}
          >
            <div className="relative">

              {/* Video preview */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={item.src}
                muted
                loop
                playsInline
                className="w-full h-56 object-cover"
                poster={item.thumbnail}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>

              {/* ▶ Play icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

            </div>

            <div className="p-4">
              <p className="text-gray-900 font-medium">{item.title}</p>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {activeItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-black rounded-xl overflow-hidden max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeItem.src}
              controls
              autoPlay
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}

    </section>
  )
}