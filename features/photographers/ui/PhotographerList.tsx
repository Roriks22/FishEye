import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { getPhotographers } from "@/infrastructure/prisma/prisma-db";
import PhotographerCard from "./PhotographerCard";
import styles from "./PhotographerList.module.scss";

export default async function PhotographerList() {
  await connection();

  let photographers;

  try {
    photographers = await getPhotographers();
    const ordreSouhaite = [
      "Mimi Keel",
      "Ellie-Rose Wilkens",
      "Tracy Galindo",
      "Nabeel Bradford",
      "Rhode Dubois",
      "Marcel Nikolic",
    ];
    photographers.sort((a, b) => {
      return ordreSouhaite.indexOf(a.name) - ordreSouhaite.indexOf(b.name);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des photographes :", error);
    return (
      <main>
        <header>
          <Image
            src={`/assets/FishEye.png`}
            alt="Fisheye Home page"
            width={200}
            height={50}
          />
        </header>
        <p role="alert">Impossible de récupérer la liste des photographes.</p>
      </main>
    );
  }

  if (photographers.length === 0) {
    return (
      <main>
        <header>
          <Image
            src={`/assets/FishEye.png`}
            alt="Fisheye Home page"
            width={200}
            height={50}
          />
        </header>
        <p>Aucun photographe n&apos;a été trouvé.</p>
      </main>
    );
  }

  return (
    <div className="pageContainer">
      <header className="siteHeader">
        <Link href="/">
          <Image
            src={`/assets/FishEye.png`}
            alt="Fisheye Home page"
            width={200}
            height={50}
          />
        </Link>
        <h1 className={styles.pageTitle}>Nos photographes</h1>
      </header>

      <main>
        <section
          className={styles.grid}
          aria-label="Listes des photographes"
        >
          {photographers.map((photographer) => (
            <PhotographerCard key={photographer.id} photographer={photographer} />
          ))}
        </section>
      </main>
    </div>
  );
}
