import { inkSplit } from "@/content/home";

/** grey prose with its key phrases in full ink (**marked** in the copy) */
export function Ink({ text }: { text: string }) {
  return (
    <>
      {inkSplit(text).map((p, i) => (p.ink ? <b key={i}>{p.text}</b> : <span key={i}>{p.text}</span>))}
    </>
  );
}
