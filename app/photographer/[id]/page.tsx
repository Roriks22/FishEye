import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPhotographerById, getMediaByPhotographerId } from "../../prisma-db";
import MediaGallery from "./MediaGallery";
import ContactForm from "./ContactForm";
import Link from "next/link";
import Image from "next/image";

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
    <main className="fisheye-container">
      {/* En-tête du photographe fidèle au Figma */}
      <header className="fisheye-header">
        <Link href="/">
          <Image
            src={`/assets/FishEye.png`}
            alt="Fisheye Home page"
            width={200}
            height={50}
          />
        </Link>
      </header>
      <section className="photographer-header-banner">
        <div className="photographer-meta">
          <h1 className="photographer-profile-name">{photographer.name}</h1>
          <p className="photographer-location">
            {photographer.city}, {photographer.country}
          </p>
          <p className="photographer-tagline">{photographer.tagline}</p>
        </div>

        <div className="contact-btn-container">
          <ContactForm photographerName={photographer.name} />
        </div>

        <div className="photographer-avatar-container">
          {photographer.portrait && (
            <Image
              src={`/assets/${photographer.portrait}`}
              alt={photographer.name}
              width={200}
              height={200}
              className="photographer-profile-avatar"
            />
          )}
        </div>
      </section>

      {/* Galerie de médias */}
      <MediaGallery media={media} photographerId={id} />

      {/* Encart fixe bas de page (Likes totaux et Tarif) */}
      <aside
        className="photographer-fixed-info"
        aria-label="Statistiques du photographe"
      >
        <span className="total-likes">
          {media.reduce((acc, curr) => acc + curr.likes, 0)}{" "}
          <Image
            className="favorite-noir"
            src={`/assets/favorite-noir.png`}
            alt="likes"
            width={21}
            height={24}
          />
        </span>
        <span className="daily-price">{photographer.price}€ / jour</span>
      </aside>
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
