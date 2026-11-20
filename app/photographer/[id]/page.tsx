import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  getPhotographerById,
  getMediaByPhotographerId,
} from "@/infrastructure/prisma/prisma-db";
import MediaGallery from "@/features/media/ui/MediaGallery";
import PhotographerHeader from "@/features/photographers/ui/PhotographerHeader";
import PhotographerStats from "@/features/photographers/ui/PhotographerStats";

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
    <main className="pageContainer">
      <PhotographerHeader photographer={photographer} />
      <MediaGallery media={media} photographerId={id} />
      <PhotographerStats
        totalLikes={media.reduce((acc, curr) => acc + curr.likes, 0)}
        dailyPrice={photographer.price}
      />
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
