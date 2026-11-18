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

  // Fermeture et navigation dans la lightbox avec le clavier
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
    <section className="gallery-section" aria-label="Galerie de médias">
      {/* Barre de tri */}
      <div className="sort-container">
        <label htmlFor="media-sort" className="sort-label">
          Trier par
        </label>
        <div className="select-wrapper">
          <select
            id="media-sort"
            className="sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="likes">Popularité</option>
            <option value="date">Date</option>
            <option value="title">Titre</option>
          </select>
        </div>
      </div>

      {/* Grille des médias */}
      <ul className="media-grid">
        {sortedMedia.map((item, index) => (
          <li key={item.id} className="media-card">
            {item.image && (
              <button
                type="button"
                className="media-thumbnail-btn"
                onClick={() => setSelectedMediaIndex(index)}
                aria-label={`Agrandir ${item.title}`}
              >
                <Image
                  src={`/assets/${item.image}`}
                  alt={item.title}
                  width={350}
                  height={350}
                  className="media-img"
                />
              </button>
            )}
            {item.video && (
              <div className="video-wrapper">
                <button
                  type="button"
                  className="expand-video-btn"
                  onClick={() => setSelectedMediaIndex(index)}
                  aria-label={`Agrandir la vidéo ${item.title}`}
                >
                  <video controls className="media-video">
                    <source src={`/assets/${item.video}`} type="video/mp4" />
                    Votre navigateur ne prend pas en charge la vidéo.
                  </video>
                </button>
              </div>
            )}

            <div className="media-footer">
              <h3 className="media-title">{item.title}</h3>
              <div className="media-likes-container">
                <span className="likes-count">{item.likes}</span>
                <button
                  type="button"
                  className="like-btn"
                  aria-label={`Ajouter un like à ${item.title}`}
                  onClick={() => likeMedia(item.id, photographerId)}
                >
                  <Image
                    src={`/assets/favorite.png`}
                    alt="likes"
                    width={21}
                    height={24}
                  />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {selectedMedia && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedMediaIndex(null)}
        >
          <div
            className="lightbox-content"
            role="dialog"
            aria-modal="true"
            aria-label={`Visualisation de ${selectedMedia.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedMediaIndex(null)}
              aria-label="Fermer la galerie"
            >
              ✕
            </button>

            <button
              type="button"
              className="lightbox-prev"
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

            <div className="lightbox-media-container">
              {selectedMedia.image && (
                <Image
                  src={`/assets/${selectedMedia.image}`}
                  alt={selectedMedia.title}
                  width={1050}
                  height={900}
                  className="lightbox-img"
                />
              )}
              {selectedMedia.video && (
                <video controls autoPlay className="lightbox-video">
                  <source
                    src={`/assets/${selectedMedia.video}`}
                    type="video/mp4"
                  />
                  Votre navigateur ne prend pas en charge la vidéo.
                </video>
              )}
              <h2 className="lightbox-title">{selectedMedia.title}</h2>
            </div>

            <button
              type="button"
              className="lightbox-next"
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
