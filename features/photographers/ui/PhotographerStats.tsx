import Image from "next/image";
import styles from "./PhotographerStats.module.scss";

type PhotographerStatsProps = {
  totalLikes: number;
  dailyPrice: number;
};

export default function PhotographerStats({
  totalLikes,
  dailyPrice,
}: PhotographerStatsProps) {
  return (
    <aside
      className={styles.fixedInfo}
      aria-label="Statistiques du photographe"
    >
      <span className={styles.totalLikes}>
        {totalLikes}{" "}
        <Image
          className="favorite-noir"
          src={`/assets/favorite-noir.png`}
          alt="likes"
          width={21}
          height={24}
        />
      </span>
      <span>{dailyPrice}€ / jour</span>
    </aside>
  );
}
