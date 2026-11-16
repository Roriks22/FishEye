import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { getPhotographers } from "./prisma-db";

async function PhotographerList() {
  await connection();

  // Récupérer la liste des photographes
  let photographers;

  try {
    photographers = await getPhotographers();
  } catch (error) {
    console.error("Erreur lors de la récupération des photographes :", error);
    return (
      <main>
        <h1>FishEye</h1>
        <p role="alert">Impossible de récupérer la liste des photographes.</p>
      </main>
    );
  }

  // Vérifier si la liste est vide
  if (photographers.length === 0) {
    return (
      <main>
        <h1>FishEye</h1>
        <p>Aucun photographe n&apos;a été trouvé.</p>
      </main>
    );
  }

  // Afficher les photographes
  return (
    <main>
      <h1>Nos photographes</h1>
      <section aria-label="Listes des photographes">
        {photographers.map((photographer) => (
          <article key={photographer.id}>
            <Link href={`/photographer/${photographer.id}`}>
              <h2>{photographer.name}</h2>
            </Link>
            <p>
              {photographer.city}, {photographer.country}
            </p>
            <p>{photographer.tagline}</p>
            <p>{photographer.price} € / jour</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main>
          <h1>FishEye</h1>
          <p>Chargement des photographes...</p>
        </main>
      }
    >
      <PhotographerList />
    </Suspense>
  );
}
