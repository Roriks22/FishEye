import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPhotographerById, getMediaByPhotographerId } from "../../prisma-db";
import MediaGallery from "./MediaGallery";

type PhotographerPageProps = {
  params: Promise<{ id: string }>;
};

async function PhotographerContent({ id }: { id: number }) {
  let photographer;
  let media;

  try {
    // Récupération des informartions du photographe et ses médias en parallèle
    [photographer, media] = await Promise.all([
      getPhotographerById(id),
      getMediaByPhotographerId(id),
    ]);
  } catch (error) {
    console.error("Erreur lors de la récupération du photographe :", error);

    return (
      <main>
        <h1>FishEye</h1>
        <p role="alert">
          Impossible de récupérer les informations du photographe.
        </p>
      </main>
    );
  }

  //  Vérifier si le photographe existe
  if (!photographer) {
    notFound();
  }

  return (
    <main>
      <header>
        <h1>{photographer.name}</h1>
        <p>
          {photographer.city}, {photographer.country}
        </p>
        <p>{photographer.tagline}</p>
        <p>{photographer.price} € / jour</p>
      </header>
      <MediaGallery media={media} photographerId={id} />
    </main>
  );
}

export default async function PhotographerPage({
  params,
}: PhotographerPageProps) {
  await connection();

  const { id } = await params;
  const photographerId = Number(id);

  if (!Number.isInteger(photographerId) || photographerId <= 0) {
    notFound();
  }

  return <PhotographerContent id={photographerId} />;
}
