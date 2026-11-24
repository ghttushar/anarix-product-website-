"use client";

import { useEffect, useRef } from "react";

/*
  Aan as the showpiece (in place of AI Studio's chrome star): the same
  diamond as the Ask Aan island, made as a real object. A rounded, softly
  pillowed square turned 45deg, in polished coral with a clearcoat, lit by a
  studio environment so light slides across it as it turns; two glossy
  eyes that blink now and then; a slow turn and a lean toward the pointer.
  three.js loads only when this mounts, and it draws only while on screen.
  Reduced motion renders one still frame.
*/
export function GlossyAan({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const el = host.current;
      if (disposed || !el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
      // neutral tone mapping keeps the coral true (ACES washes it to pink)
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      scene.environmentIntensity = 0.85;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 6.9);

      const aan = new THREE.Group();
      scene.add(aan);

      // the body: a pillowed rounded square, turned into a diamond
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(1.7, 1.7, 0.78, 10, 0.36),
        new THREE.MeshPhysicalMaterial({ color: "#ee4f5d", metalness: 0.12, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.03 }),
      );
      body.rotation.z = Math.PI / 4;
      aan.add(body);

      // the eyes, upright on the front
      const eyeMat = new THREE.MeshPhysicalMaterial({ color: "#14080b", roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02 });
      const eyeGeo = new THREE.SphereGeometry(0.105, 32, 32);
      const eyes = [-0.27, 0.27].map((x) => {
        const e = new THREE.Mesh(eyeGeo, eyeMat);
        e.scale.set(1, 1.32, 0.55);
        e.position.set(x, 0.1, 0.4);
        aan.add(e);
        return e;
      });

      // a key light from above left and a coral rim from behind
      const key = new THREE.DirectionalLight("#ffffff", 1.4);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight("#8b9cf0", 1.6);
      rim.position.set(4, -2, -3);
      scene.add(rim);

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
        ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let raf = 0;
      let running = false;
      let nextBlink = 2500;
      const frame = (t: number) => {
        ptr.x += (ptr.tx - ptr.x) * 0.05;
        ptr.y += (ptr.ty - ptr.y) * 0.05;
        aan.rotation.y = Math.sin(t * 0.00035) * 0.38 + ptr.x * 0.35;
        aan.rotation.x = Math.sin(t * 0.00027) * 0.12 + ptr.y * 0.25;
        aan.position.y = Math.sin(t * 0.0009) * 0.06;
        // a blink every few seconds
        const since = t - nextBlink;
        const lid = since > 0 && since < 140 ? 0.12 : 1.32;
        eyes.forEach((e) => (e.scale.y = lid));
        if (since >= 140) nextBlink = t + 2600 + Math.random() * 2600;
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (running || reduced) return;
        running = true;
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      frame(0);
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
      io.observe(el);

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        body.geometry.dispose();
        (body.material as InstanceType<typeof THREE.MeshPhysicalMaterial>).dispose();
        eyeGeo.dispose();
        eyeMat.dispose();
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
