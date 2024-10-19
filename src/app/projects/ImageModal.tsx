"use client";

import Image from "next/image";

interface ImageModalProps {
  image: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div className="relative">
        <Image
          src={image}
          alt="Modal Image"
          className="object-contain max-w-full max-h-full"
          width={1600}
          height={900}
        />
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
