import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPhotographers } from "./prisma-db";

async function PhotographerList() {
  await connection();

  let photographers;

  try {
    photographers = await getPhotographers();
    // Ordre exact des prénoms voulu
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
      <main className="container">
        <header className="header">
          <span className="logo">
            Fish<span className="logo-at">@</span>ye
          </span>
        </header>
        <p role="alert">Impossible de récupérer la liste des photographes.</p>
      </main>
    );
  }

  if (photographers.length === 0) {
    return (
      <main className="container">
        <header className="header">
          <span className="logo">
            Fish<span className="logo-at">@</span>ye
          </span>
        </header>
        <p>Aucun photographe n&apos;a été trouvé.</p>
      </main>
    );
  }

  return (
    <div className="fisheye-container">
      {/* En-tête avec le logo et le titre de la page */}
      <header className="fisheye-header">
        <Link href="/">
          <Image
            src={`/assets/FishEye.png`}
            alt="FishEye"
            width={200}
            height={50}
          />
        </Link>

        <h1 className="page-title">Nos photographes</h1>
      </header>

      {/* Grille des photographes */}
      <main>
        <section
          className="photographers-grid"
          aria-label="Listes des photographes"
        >
          {photographers.map((photographer) => (
            <article key={photographer.id} className="photographer-card">
              <Link
                href={`/photographer/${photographer.id}`}
                className="photographer-profile-link"
              >
                <div className="avatar-wrapper">
                  {/* Assurez-vous d'avoir un champ portrait dans votre base de données/prisma */}
                  <Image
                    src={`/assets/${photographer.portrait}`}
                    alt={photographer.name}
                    width={200}
                    height={200}
                    className="photographer-avatar"
                  />
                </div>
                <h2 className="photographer-name">{photographer.name}</h2>
              </Link>
              <div className="photographer-info">
                <p className="location">
                  {photographer.city}, {photographer.country}
                </p>
                <p className="tagline">{photographer.tagline}</p>
                <p className="price">{photographer.price}€/jour</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="fisheye-container">
          <h1 className="logo">
            Fish<span className="logo-at">@</span>ye
          </h1>
          <p>Chargement des photographes...</p>
        </main>
      }
    >
      <PhotographerList />
    </Suspense>
  );
}
