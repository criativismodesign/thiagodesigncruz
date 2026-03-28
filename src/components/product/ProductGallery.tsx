"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // If only one image, show it without thumbnails
  if (images.length === 1) {
    return (
      <div className="space-y-4">
        <div 
          className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[0]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <Lightbox 
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={images}
          currentIndex={0}
          productName={productName}
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${productName} - Imagem ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-xs text-white">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                index === currentImageIndex
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={currentImageIndex}
        productName={productName}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  productName: string;
  onIndexChange?: (index: number) => void;
}

function Lightbox({ isOpen, onClose, images, currentIndex, productName, onIndexChange }: LightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState(currentIndex);

  useEffect(() => {
    setLightboxIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    const newIndex = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-4 sm:-right-12 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image counter */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 sm:top-4 sm:left-4 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-sm text-white">
          {lightboxIndex + 1}/{images.length}
        </div>

        {/* Main image */}
        <div className="relative">
          <img
            src={images[lightboxIndex]}
            alt={`${productName} - Imagem ${lightboxIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white hover:bg-black/70 transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white hover:bg-black/70 transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setLightboxIndex(index);
                  onIndexChange?.(index);
                }}
                className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                  index === lightboxIndex
                    ? "border-white ring-2 ring-white/50"
                    : "border-white/30 hover:border-white/50"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
