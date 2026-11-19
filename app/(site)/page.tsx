import { HeroScreen } from "@/components/home/HeroScreen";
import { NightWatchScreen } from "@/components/home/NightWatchScreen";
import { TrustScreen } from "@/components/home/TrustScreen";
import { ProductScreen } from "@/components/home/ProductScreen";
import { CloseScreen } from "@/components/home/CloseScreen";
import { TourScreen } from "@/components/home/TourScreen";
import { products, tour } from "@/content/home";

/* The promise and its proof, one night with Aan, the products in the order a
   seller meets them, why you can trust it, what it plugs into, and the film.
   The product tour appears after the hero once its recording exists. */
export default function Home() {
  const mcp = products.find((p) => p.id === "mcp");
  return (
    <>
      <HeroScreen />
      {tour.video && <TourScreen />}
      <NightWatchScreen />
      {products
        .filter((p) => p.id !== "mcp")
        .map((p) => (
          <ProductScreen key={p.id} p={p} />
        ))}
      <TrustScreen />
      {mcp && <ProductScreen p={mcp} />}
      <CloseScreen />
    </>
  );
}
