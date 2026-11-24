import { HeroScreen } from "@/components/home/HeroScreen";
import { TourScreen } from "@/components/home/TourScreen";
import { RingScene } from "@/components/home/journey/ProductRing";
import { Manifesto } from "@/components/home/journey/Manifesto";
import { NightGallery } from "@/components/home/journey/NightGallery";
import { Finale } from "@/components/home/journey/Finale";
import { tour } from "@/content/home";

/* The homepage as one scroll journey (Phase 9, structure from the
   Superconscious reference): the promise; the products on a ring that
   settles on Aan; the burst through Aan's hollow diamond, where the Anarix
   mark rises; what Aan is, word by word; one night with Aan as a sideways
   gallery; and the fragments of how far Aan goes converging on the card
   that opens into the close. */
export default function Home() {
  return (
    <>
      <HeroScreen />
      {tour.video && <TourScreen />}
      <RingScene />
      <Manifesto />
      <NightGallery />
      <Finale />
    </>
  );
}
