"use client";

import { H3 } from "./ui/H3";
import { Github } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  challenges?: string;
  results?: string;
  link?: string;
  linkText?: string;
  githubLink?: string;
  images?: string[]; // Array de imágenes para el carrusel
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  challenges,
  results,
  link,
  linkText,
  githubLink,
  images = [],
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones para avanzar y retroceder en el carrusel
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="transform rounded-lg border bg-background p-6 shadow-lg transition hover:scale-105 hover:shadow-xl">
      {/* Carrusel de imágenes */}
      {images.length > 0 && (
        <div className="relative mb-4">
          <Image
            src={images[currentImage]}
            alt={`${title} image ${currentImage + 1}`}
            className="rounded-lg shadow"
            width={1600}
            height={900}
            onClick={openModal} // Abre el modal al hacer clic en la imagen
          />
          {/* Botones de navegación del carrusel */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
          >
            &#10095;
          </button>
        </div>
      )}

      {/* Título y Descripción */}
      <div className="mb-4 flex items-center justify-between">
        <H3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </H3>
        {/* Icono de GitHub */}
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repo"
          >
            <Github
              size={30}
              className="text-gray-900 transition duration-300 hover:text-blue-600 dark:text-white"
            />
          </a>
        )}
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{description}</p>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        <span className="font-bold">Challenges:</span> {challenges}
      </p>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        <span className="font-bold">Results:</span> {results}
      </p>

      {/* Enlace adicional (si existe) */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          {linkText || "Learn More"}
        </a>
      )}
    </div>
  );
};

export default ProjectCard;
