"use client";

import { LazyImageLoader, useImageCache } from "@/hooks/use-image";
import { AlertCircle, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  priority?: "lazy" | "eager";
}

export function CachedImage({
  src,
  alt,
  className,
  width,
  height,
  onLoad,
  onError,
  priority = "lazy",
}: CachedImageProps) {
  const { src: cachedSrc, loading, error } = useImageCache(src);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (error || imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted border border-border rounded ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Failed to load image</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-muted border border-border rounded animate-pulse ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={cachedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority}
    />
  );
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

let globalLoader: LazyImageLoader | null = null;

export function LazyImage({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==",
  onLoad,
  onError,
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!globalLoader) {
      globalLoader = new LazyImageLoader();
    }

    const img = imgRef.current;
    if (img) {
      img.setAttribute("data-src", src);
      globalLoader.observe(img);
    }

    return () => {
      if (globalLoader && img) {
        globalLoader.disconnect();
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={placeholder}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? "loaded" : ""} ${
        hasError ? "error" : ""
      }`}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        transition: "opacity 0.3s ease-in-out",
        opacity: isLoaded ? 1 : 0.7,
      }}
    />
  );
}
