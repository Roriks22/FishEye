import { Suspense } from "react";
import Image from "next/image";
import PhotographerList from "@/features/photographers/ui/PhotographerList";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="pageContainer">
            <Image
              src={`/assets/FishEye.png`}
              alt="Fisheye Home page"
              width={200}
              height={50}
            />
          <p>Chargement des photographes...</p>
        </main>
      }
    >
      <PhotographerList />
    </Suspense>
  );
}
