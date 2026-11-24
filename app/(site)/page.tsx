import { TourScreen } from "@/components/home/TourScreen";
import { Intro } from "@/components/home/layers/Intro";
import { Gallery } from "@/components/home/layers/Gallery";
import { Finale } from "@/components/home/layers/Finale";
import { tour } from "@/content/home";

/* The homepage in the AI Studio design (getlayers), re-purposed for Anarix:
   the hero card collapses into a ring of every product, Aan's shape opens
   onto the world inside, then the products as a gallery, the fragments of
   how far Aan goes converging, and the close. */
export default function Home() {
  return (
    <>
      <Intro />
      <Gallery />
      <Finale />
      {tour.video && <TourScreen />}
    </>
  );
}
