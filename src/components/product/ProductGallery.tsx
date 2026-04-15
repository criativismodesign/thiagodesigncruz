'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: { url: string; ordem: number }[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        {images[selectedImage] ? (
          <img
            src={images[selectedImage].url}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-400">Imagem não disponível</span>
          </div>
        )}
      </div>
      
      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={image.ordem}
              onClick={() => setSelectedImage(index)}
              className={`h-20 w-20 overflow-hidden rounded border-2 ${
                selectedImage === index ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image.url}
                alt={`${productName} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
