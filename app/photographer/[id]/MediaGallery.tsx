"use client";

import Image from "next/image";
import { useState } from "react";
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
        {sortedMedia.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.image && (
              <Image
                src={`/assets/${item.image}`}
                alt={item.title}
                width={500}
                height={500}
              />
            )}
            {item.video && (
              <video controls>
                <source src={`/assets/${item.video}`} type="video/mp4" />
                Votre navigateur ne prend pas en charge la vidéo.
              </video>
            )}
            <p>
              {item.likes}{" "}
              <button
                type="button"
                aria-label={`Ajouter un like à {item.title}`}
                onClick={() => likeMedia(item.id, photographerId)}
              >
                ♡
              </button>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
