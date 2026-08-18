"use client";

import Image from "next/image";

interface RestaurantGalleryProps {
  images: string[];
  name: string;
}

export default function RestaurantGallery({
  images,
  name,
}: RestaurantGalleryProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
      {images.map((src, i) => (
        <div
          key={i}
          className="relative shrink-0 w-full sm:w-[400px] aspect-[16/10] rounded-xl overflow-hidden snap-center"
        >
          <Image
            src={src}
            alt={`${name} ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
