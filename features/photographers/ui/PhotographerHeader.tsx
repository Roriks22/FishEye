import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/features/contact/ui/ContactForm";
import type { Photographer } from "../types";
import styles from "./PhotographerHeader.module.scss";

type PhotographerHeaderProps = {
  photographer: Photographer;
};

export default function PhotographerHeader({
  photographer,
}: PhotographerHeaderProps) {
  return (
    <>
      <header className="siteHeader">
        <Link href="/">
          <Image
            src={`/assets/FishEye.png`}
            alt="Fisheye Home page"
            width={200}
            height={50}
          />
        </Link>
      </header>
      <section className={styles.profileBanner}>
        <div className={styles.meta}>
          <h1 className={styles.profileName}>{photographer.name}</h1>
          <p className={styles.location}>
            {photographer.city}, {photographer.country}
          </p>
          <p className={styles.tagline}>{photographer.tagline}</p>
        </div>

        <div>
          <ContactForm photographerName={photographer.name} />
        </div>

        <div className={styles.avatarContainer}>
          {photographer.portrait && (
            <Image
              src={`/assets/${photographer.portrait}`}
              alt={photographer.name}
              width={200}
              height={200}
              className={styles.profileAvatar}
            />
          )}
        </div>
      </section>
    </>
  );
}
