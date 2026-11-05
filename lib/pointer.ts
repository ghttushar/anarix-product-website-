// One shared pointer listener for every Aan on the page (eyes follow it).
type Listener = (x: number, y: number) => void;

const listeners = new Set<Listener>();
let started = false;
let px = -1;
let py = -1;
let frame = 0;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  px = window.innerWidth / 2;
  py = window.innerHeight * 0.4;
  window.addEventListener(
    "pointermove",
    (e) => {
      px = e.clientX;
      py = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        listeners.forEach((l) => l(px, py));
      });
    },
    { passive: true },
  );
}

export function subscribePointer(l: Listener) {
  start();
  listeners.add(l);
  l(px, py);
  return () => {
    listeners.delete(l);
  };
}

export function lastPointer() {
  return { x: px, y: py };
}
