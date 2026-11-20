import type { Media, MediaSortBy } from "../types";

export function sortMedia(media: Media[], sortBy: MediaSortBy) {
  return [...media].sort((a, b) => {
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
}
