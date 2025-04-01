"use client";

import Image from "next/image";
import { useState } from "react";

interface EventImageProps {
  src: string;
  alt: string;
  isBanner?: boolean;
}

export default function EventImage({
  src,
  alt,
  isBanner = false,
}: EventImageProps) {
  const [hasError, setHasError] = useState(false);

  // For banner, just hide on error
  if (isBanner) {
    if (hasError) return null;

    return (
      <div className="relative w-full h-48 md:h-64 lg:h-80">
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          priority
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // For poster, show fallback image
  return (
    <div className="relative aspect-[2/3] w-full rounded overflow-hidden shadow">
      <Image
        src={hasError ? "/images/posters/placeholder-poster.png" : src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
