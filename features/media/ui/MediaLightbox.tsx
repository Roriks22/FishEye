import { useEffect } from "react";
import Image from "next/image";
import type { Media } from "../types";
import styles from "./MediaLightbox.module.scss";

type MediaLightboxProps = {
  media: Media;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function MediaLightbox({
  media,
  onClose,
  onPrevious,
  onNext,
}: MediaLightboxProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        onNext();
      }
      if (event.key === "ArrowLeft") {
        onPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        aria-label="image closeup view"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fermer la galerie"
        >
          ✕
        </button>

        <button
          type="button"
          className={styles.previous}
          onClick={onPrevious}
          aria-label="Média précédent"
        >
          ‹
        </button>

        <div className={styles.mediaContainer}>
          {media.image && (
            <Image
              src={`/assets/${media.image}`}
              alt={media.title}
              width={1050}
              height={900}
              className={styles.image}
            />
          )}
          {media.video && (
            <video controls autoPlay className={styles.video}>
              <source src={`/assets/${media.video}`} type="video/mp4" />
              Votre navigateur ne prend pas en charge la vidéo.
            </video>
          )}
          <h2 className={styles.title}>{media.title}</h2>
        </div>

        <button
          type="button"
          className={styles.next}
          onClick={onNext}
          aria-label="Média suivant"
        >
          ›
        </button>
      </div>
    </div>
  );
}
