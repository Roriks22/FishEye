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

const SORT_OPTIONS = [
  { value: "likes", label: "Popularité" },
  { value: "date", label: "Date" },
  { value: "title", label: "Titre" },
];

export default function MediaGallery({
  media,
  photographerId,
}: MediaGalleryProps) {
  const [sortBy, setSortBy] = useState("likes");
  const [isSortOpen, setIsSortOpen] = useState(false);
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

  // Fermeture du menu de tri avec Échap
  useEffect(() => {
    if (!isSortOpen) return;

    function handleSortKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }

    window.addEventListener("keydown", handleSortKeyDown);
    return () => {
      window.removeEventListener("keydown", handleSortKeyDown);
    };
  }, [isSortOpen]);

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
          current === null
            ? null
            : (current - 1 + sortedMedia.length) % sortedMedia.length,
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

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ??
    "Popularité";

  const dropdownOptions = SORT_OPTIONS.filter(
    (option) => option.value !== sortBy,
  );

  return (
    <section className="gallery-section" aria-label="Galerie de médias">
      {/* Barre de tri (bouton + listbox ARIA fidèle à la maquette) */}
      <div className="sort-container">
        <span id="media-sort-label" className="sort-label">
          Trier par
        </span>
        <div className="select-wrapper">
          <button
            type="button"
            id="media-sort"
            className={`sort-button ${isSortOpen ? "open" : ""}`}
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            aria-labelledby="media-sort-label media-sort"
            onClick={() => setIsSortOpen((open) => !open)}
          >
            <span>{currentSortLabel}</span>
            <span
              className={`select-arrow ${isSortOpen ? "open" : ""}`}
              aria-hidden="true"
            />
          </button>

          {isSortOpen && (
            <ul
              className="sort-options-list"
              role="listbox"
              aria-labelledby="media-sort-label"
            >
              {dropdownOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={false}
                  className="sort-option-item"
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
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
              <div
                className="video-wrapper"
                role="button"
                tabIndex={0}
                aria-label={`Ouvrir ${item.title} dans la lightbox`}
                onClick={() => setSelectedMediaIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedMediaIndex(index);
                  }
                }}
              >
                <video className="media-video" muted preload="metadata">
                  <source src={`/assets/${item.video}`} type="video/mp4" />
                  Votre navigateur ne prend pas en charge la vidéo.
                </video>
                <span className="expand-video-btn" aria-hidden="true"></span>
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
            aria-label="image closeup view"
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
