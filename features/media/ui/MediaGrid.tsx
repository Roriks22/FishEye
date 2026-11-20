import MediaCard from "./MediaCard";
import type { Media } from "../types";
import styles from "./MediaGrid.module.scss";

type MediaGridProps = {
  media: Media[];
  onSelect: (index: number) => void;
  onLike: (mediaId: number) => void;
};

export default function MediaGrid({
  media,
  onSelect,
  onLike,
}: MediaGridProps) {
  return (
    <ul className={styles.grid}>
      {media.map((item, index) => (
        <MediaCard
          key={item.id}
          media={item}
          onOpen={() => onSelect(index)}
          onLike={() => onLike(item.id)}
        />
      ))}
    </ul>
  );
}
