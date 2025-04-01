"use client";

import Image from "next/image";
import { useState } from "react";
import { Sparkles, ImageIcon } from "lucide-react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  // For banner, just hide on error or show comic-styled placeholder
  if (isBanner) {
    if (hasError) return null;

    return (
      <div className="relative w-full h-48 md:h-64 lg:h-80">
        {/* Comic book border frame */}
        <div className="absolute inset-0 border-[4px] border-black rounded-lg z-10 pointer-events-none shadow-[8px_8px_0px_0px_rgba(0,0,0)]"></div>

        {/* Halftone pattern overlay */}
        <div
          className="absolute inset-0 z-20 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "6px 6px",
          }}
        ></div>

        {/* Actual image */}
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className="transition-opacity duration-300"
          />
        </div>

        {/* Comic decorations */}
        <div className="absolute top-3 right-3 z-30">
          <div className="relative">
            <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-lg border-[3px] border-black transform rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse">
              <Sparkles className="h-3 w-3 mr-1 inline-block" strokeWidth={3} />
              <span>SUPER!</span>
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // For poster, show fallback image with comic styling
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden transform transition-all duration-300 hover:scale-105">
      {/* Comic book frame */}
      <div className="absolute inset-0 border-[4px] border-black rounded-lg z-10 pointer-events-none shadow-[5px_5px_0px_0px_rgba(0,0,0)]"></div>

      {/* Halftone pattern overlay */}
      <div
        className="absolute inset-0 z-20 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
          backgroundSize: "4px 4px",
        }}
      ></div>

      {/* Actual image or fallback */}
      <div className="relative w-full h-full rounded overflow-hidden">
        <Image
          src={hasError ? "/images/posters/placeholder-poster.png" : src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Placeholder shown until image loads */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="text-white font-boldonse flex flex-col items-center">
              <ImageIcon className="h-8 w-8 mb-2" strokeWidth={2} />
              <span className="animate-pulse">LOADING...</span>
            </div>
          </div>
        )}
      </div>

      {/* Comic decorations */}
      <div className="absolute bottom-3 left-3 z-30">
        <div className="relative">
          <div className="bg-red-500 text-white font-bold px-2 py-1 rounded-lg border-[2px] border-black transform -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse text-xs">
            <span>{hasError ? "POSTER!" : "EXCITING!"}</span>
          </div>
          <div className="absolute -top-1 -left-1 h-2 w-2 bg-yellow-400 border-[1px] border-black rounded-full"></div>
        </div>
      </div>

      {/* Top right decoration dot */}
      <div className="absolute top-2 right-2 h-4 w-4 bg-green-500 border-[2px] border-black rounded-full z-30"></div>
    </div>
  );
}
