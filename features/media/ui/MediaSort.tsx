import { useEffect, useState } from "react";
import type { MediaSortBy } from "../types";
import styles from "./MediaSort.module.scss";

type MediaSortProps = {
  sortBy: MediaSortBy;
  onSortChange: (sortBy: MediaSortBy) => void;
};

const SORT_OPTIONS: { value: MediaSortBy; label: string }[] = [
  { value: "likes", label: "Popularité" },
  { value: "date", label: "Date" },
  { value: "title", label: "Titre" },
];

export default function MediaSort({ sortBy, onSortChange }: MediaSortProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

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

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ??
    "Popularité";
  const dropdownOptions = SORT_OPTIONS.filter(
    (option) => option.value !== sortBy,
  );

  return (
    <div className={styles.sortContainer}>
      <span id="media-sort-label" className={styles.sortLabel}>
        Trier par
      </span>
      <div className={styles.selectWrapper}>
        <button
          type="button"
          id="media-sort"
          className={`${styles.sortButton} ${isSortOpen ? styles.sortButtonOpen : ""}`}
          aria-haspopup="listbox"
          aria-expanded={isSortOpen}
          aria-labelledby="media-sort-label media-sort"
          onClick={() => setIsSortOpen((open) => !open)}
        >
          <span>{currentSortLabel}</span>
          <span
            className={`${styles.arrow} ${isSortOpen ? styles.arrowOpen : ""}`}
            aria-hidden="true"
          />
        </button>

        {isSortOpen && (
          <ul
            className={styles.optionsList}
            role="listbox"
            aria-labelledby="media-sort-label"
          >
            {dropdownOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={false}
                className={styles.option}
                onClick={() => {
                  onSortChange(option.value);
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
  );
}
