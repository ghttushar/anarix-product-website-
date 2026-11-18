import { HeroScreen } from "@/components/home/HeroScreen";
import { MissionScreen } from "@/components/home/MissionScreen";
import { NightWatchScreen } from "@/components/home/NightWatchScreen";
import { GoodScreen } from "@/components/home/GoodScreen";
import { ProductScreen } from "@/components/home/ProductScreen";
import { CloseScreen } from "@/components/home/CloseScreen";
import { products } from "@/content/home";

/* Ten screens, one idea each (docs/redesign/04-screen-specs.md): the promise,
   its proof, the night it keeps, why that matters, five products, and Aan. */
export default function Home() {
  return (
    <>
      <HeroScreen />
      <MissionScreen />
      <NightWatchScreen />
      <GoodScreen />
      {products.map((p) => (
        <ProductScreen key={p.id} p={p} />
      ))}
      <CloseScreen />
    </>
  );
}
