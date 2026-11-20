import Image from "next/image";
import Link from "next/link";
import type { Photographer } from "../types";
import styles from "./PhotographerCard.module.scss";

type PhotographerCardProps = {
  photographer: Photographer;
};

export default function PhotographerCard({
  photographer,
}: PhotographerCardProps) {
  return (
    <article className={styles.card}>
      <Link
        href={`/photographer/${photographer.id}`}
        className={styles.profileLink}
      >
        <div className={styles.avatarWrapper}>
          <Image
            src={`/assets/${photographer.portrait}`}
            alt=""
            width={200}
            height={200}
            className={styles.avatar}
          />
        </div>
        <h2 className={styles.name}>{photographer.name}</h2>
      </Link>
      <div className={styles.info}>
        <p className={styles.location}>
          {photographer.city}, {photographer.country}
        </p>
        <p className={styles.tagline}>{photographer.tagline}</p>
        <p className={styles.price}>{photographer.price}€/jour</p>
      </div>
    </article>
  );
}
