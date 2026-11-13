import { connection } from "next/server";
import { Suspense } from "react";
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
        <p>Impossible de récupérer la liste des photographes.</p>
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
      <h1>Liste des photographes</h1>

      <ul>
        {photographers.map((photographer) => (
          <li key={photographer.id}>
            <h2>{photographer.name}</h2>
            <p>
              {photographer.city}, {photographer.country}
            </p>
          </li>
        ))}
      </ul>
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
