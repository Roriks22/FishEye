import { PrismaClient } from "../generated/prisma/client";
import { resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.startsWith("file:")) {
  throw new Error(
    'DATABASE_URL doit être une URL de fichier SQLite commençant par "file:".',
  );
}

const databasePath = databaseUrl.slice("file:".length);

const prisma = new PrismaClient({
  datasourceUrl: `file:${resolve(process.cwd(), "prisma", databasePath)}`,
});

// Récupérer la liste de tous les photographes

export async function getPhotographers() {
  return prisma.photographer.findMany();
}

// Récupérer un phtographe à partir de son ID
export async function getPhotographerById(id: number) {
  return prisma.photographer.findUnique({
    where: {
      id: id,
    },
  });
}

// Récupérer les médias d'un photographe à partir de son ID
export async function getMediaByPhotographerId(id: number) {
  return prisma.media.findMany({
    where: {
      photographerId: id,
    },
  });
}

// Ajouter un like à un média à partir de son ID
export async function addLikeToMedia(id: number) {
  return prisma.media.update({
    where: {
      id: id,
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  });
}
