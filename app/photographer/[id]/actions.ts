"use server";

import { addLikeToMedia } from "@/app/prisma-db";
import { revalidatePath } from "next/cache";

export async function likeMedia(mediaId: number, photographerId: number) {
  await addLikeToMedia(mediaId);

  revalidatePath(`/photographer/${photographerId}`);
}
