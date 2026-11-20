import Image from "next/image";
import type { Media } from "../types";
import styles from "./MediaCard.module.scss";

type MediaCardProps = {
  media: Media;
  onOpen: () => void;
  onLike: () => void;
};

export default function MediaCard({ media, onOpen, onLike }: MediaCardProps) {
  return (
    <li className={styles.card}>
      {media.image && (
        <button
          type="button"
          className={styles.thumbnailButton}
          onClick={onOpen}
        >
          <Image
            src={`/assets/${media.image}`}
            alt={media.title}
            width={350}
            height={350}
            className={styles.image}
          />
        </button>
      )}

      {media.video && (
        <div
          className={styles.videoWrapper}
          role="button"
          tabIndex={0}
          aria-label={`Ouvrir ${media.title} dans la lightbox`}
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen();
            }
          }}
        >
          <video className={styles.video} muted preload="metadata">
            <source src={`/assets/${media.video}`} type="video/mp4" />
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
          <span className={styles.expandVideoButton} aria-hidden="true"></span>
        </div>
      )}

      <div className={styles.footer}>
        <h3 className={styles.title}>{media.title}</h3>
        <div className={styles.likesContainer}>
          <span>{media.likes}</span>
          <button
            type="button"
            className={styles.likeButton}
            aria-label={`Ajouter un like à ${media.title}`}
            onClick={onLike}
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
  );
}
