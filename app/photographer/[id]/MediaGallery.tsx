"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { likeMedia } from "./actions";

type Media = {
  id: number;
  title: string;
  image: string | null;
  video: string | null;
  likes: number;
  date: string;
};

type MediaGalleryProps = {
  media: Media[];
  photographerId: number;
};

export default function MediaGallery({
  media,
  photographerId,
}: MediaGalleryProps) {
  const [sortBy, setSortBy] = useState("likes");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );

  // Créer une copie du tableau avant de le trier
  const sortedMedia = [...media].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes;
    }
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  //   Fermeture et navigation dans la lightbox avec le clavier
  useEffect(() => {
    if (selectedMediaIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedMediaIndex(null);
      }
      if (event.key === "ArrowRight") {
        setSelectedMediaIndex((current) =>
          current === null ? null : (current + 1) % sortedMedia.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setSelectedMediaIndex((current) =>
          current === null ? null : (current - 1) % sortedMedia.length,
        );
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMediaIndex, sortedMedia.length]);

  const selectedMedia =
    selectedMediaIndex !== null ? sortedMedia[selectedMediaIndex] : null;

  return (
    <section aria-label="Galerie de médias">
      <div>
        <label htmlFor="media-sort">Trier par :</label>
        <select
          id="media-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="likes">Popularité</option>
          <option value="date">Date</option>
          <option value="title">Titre</option>
        </select>
      </div>
      <ul>
        {sortedMedia.map((item, index) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.image && (
              <button
                type="button"
                onClick={() => setSelectedMediaIndex(index)}
                aria-label={`Agrandir ${item.title}`}
              >
                <Image
                  src={`/assets/${item.image}`}
                  alt={item.title}
                  width={500}
                  height={500}
                />
              </button>
            )}
            {item.video && (
              <>
                <video controls>
                  <source src={`/assets/${item.video}`} type="video/mp4" />
                  Votre navigateur ne prend pas en charge la vidéo.
                </video>
                <button
                  type="button"
                  onClick={() => setSelectedMediaIndex(index)}
                >
                  Agrandir la vidéo
                </button>
              </>
            )}
            <p>
              {item.likes}{" "}
              <button
                type="button"
                aria-label={`Ajouter un like à ${item.title}`}
                onClick={() => likeMedia(item.id, photographerId)}
              >
                ♡
              </button>
            </p>
          </li>
        ))}
      </ul>
      {/* Lightbox */}
      {selectedMedia && (
        <div className="lightbox" onClick={() => setSelectedMediaIndex(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Visualisation de ${selectedMedia.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMediaIndex(null)}
              aria-label="Fermer la galerie"
            >
              x
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedMediaIndex === null) return;
                setSelectedMediaIndex(
                  (selectedMediaIndex - 1 + sortedMedia.length) %
                    sortedMedia.length,
                );
              }}
              aria-label="Média précédent"
            >
              ‹
            </button>
            {selectedMedia.image && (
              <Image
                src={`/assets/${selectedMedia.image}`}
                alt={selectedMedia.title}
                width={1200}
                height={800}
              />
            )}
            {selectedMedia.video && (
              <video controls autoPlay>
                <source
                  src={`/assets/${selectedMedia.video}`}
                  type="video/mp4"
                />
                Votre navigateur ne prend pas en charge la vidéo.
              </video>
            )}
            <h2>{selectedMedia.title}</h2>
            <button
              type="button"
              onClick={() => {
                if (selectedMediaIndex === null) return;
                setSelectedMediaIndex(
                  (selectedMediaIndex + 1) % sortedMedia.length,
                );
              }}
              aria-label="Média suivant"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
