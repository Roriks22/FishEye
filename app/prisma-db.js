import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Récupérer la liste de tous les photographes
export async function getPhotographers() {
  return await prisma.photographers.findMany();
}

// Récupérer un phtographe à partir de son ID
export async function getPhotographerById(id) {
  return await prisma.photographer.findUnique({
    where: {
      id: id,
    },
  });
}

// Récupérer les médias d'un photographe à partir de son ID
export async function getMediaByPhotographerId(id) {
  return await prisma.media.findMany({
    where: {
      photographerId: id,
    },
  });
}

// Ajouter un like à un média à partir de son ID
export async function addLikeToMedia(id) {
  return await prisma.media.update({
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
