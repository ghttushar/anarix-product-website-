import { HeroScreen } from "@/components/home/HeroScreen";
import { MissionScreen } from "@/components/home/MissionScreen";
import { NightWatchScreen } from "@/components/home/NightWatchScreen";
import { GoodScreen } from "@/components/home/GoodScreen";
import { ProductScreen } from "@/components/home/ProductScreen";
import { CloseScreen } from "@/components/home/CloseScreen";
import { TourScreen } from "@/components/home/TourScreen";
import { WorksWithScreen } from "@/components/home/WorksWithScreen";
import { products } from "@/content/home";

/* The promise, its proof, the product tour, the night it keeps, why that
   matters, five products, where it plugs in, and Aan. */
export default function Home() {
  return (
    <>
      <HeroScreen />
      <MissionScreen />
      <TourScreen />
      <NightWatchScreen />
      <GoodScreen />
      {products.map((p) => (
        <ProductScreen key={p.id} p={p} />
      ))}
      <WorksWithScreen />
      <CloseScreen />
    </>
  );
}
