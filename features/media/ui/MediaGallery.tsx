"use client";

import { useCallback, useState } from "react";
import { likeMedia } from "@/app/photographer/[id]/actions";
import { sortMedia } from "../lib/sortMedia";
import type { Media, MediaSortBy } from "../types";
import MediaGrid from "./MediaGrid";
import MediaLightbox from "./MediaLightbox";
import MediaSort from "./MediaSort";
import styles from "./MediaGallery.module.scss";

type MediaGalleryProps = {
  media: Media[];
  photographerId: number;
};

export default function MediaGallery({
  media,
  photographerId,
}: MediaGalleryProps) {
  const [sortBy, setSortBy] = useState<MediaSortBy>("likes");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );

  const sortedMedia = sortMedia(media, sortBy);
  const selectedMedia =
    selectedMediaIndex !== null ? sortedMedia[selectedMediaIndex] : null;

  const closeLightbox = useCallback(() => {
    setSelectedMediaIndex(null);
  }, []);

  const showPreviousMedia = useCallback(() => {
    setSelectedMediaIndex((current) =>
      current === null
        ? null
        : (current - 1 + sortedMedia.length) % sortedMedia.length,
    );
  }, [sortedMedia.length]);

  const showNextMedia = useCallback(() => {
    setSelectedMediaIndex((current) =>
      current === null ? null : (current + 1) % sortedMedia.length,
    );
  }, [sortedMedia.length]);

  return (
    <section className={styles.gallery} aria-label="Galerie de médias">
      <MediaSort sortBy={sortBy} onSortChange={setSortBy} />
      <MediaGrid
        media={sortedMedia}
        onSelect={setSelectedMediaIndex}
        onLike={(mediaId) => likeMedia(mediaId, photographerId)}
      />
      {selectedMedia && (
        <MediaLightbox
          media={selectedMedia}
          onClose={closeLightbox}
          onPrevious={showPreviousMedia}
          onNext={showNextMedia}
        />
      )}
    </section>
  );
}
