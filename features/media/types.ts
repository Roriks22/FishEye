export type Media = {
  id: number;
  title: string;
  image: string | null;
  video: string | null;
  likes: number;
  date: string;
};

export type MediaSortBy = "likes" | "date" | "title";
