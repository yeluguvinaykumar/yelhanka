"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduce || pathname.startsWith("/admin")) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let frame = 0;

    const render = () => {
      ring.x += (pointer.x - ring.x) * 0.16;
      ring.y += (pointer.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      const nextLabel = labelled?.dataset.cursor ?? "";
      setLabel(nextLabel);
      setHovering(Boolean(labelled || interactive));
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest("a, button, [role='button'], [data-cursor]")) {
        setHovering(false);
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => ringRef.current?.classList.add("scale-75");
    const onUp = () => ringRef.current?.classList.remove("scale-75");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[130] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms" }}
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-burgundy"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-forest/45 bg-transparent text-center transition-[width,height,background-color,border-color] duration-300 ease-premium"
        style={{
          width: label ? 92 : hovering ? 54 : 34,
          height: label ? 92 : hovering ? 54 : 34,
          backgroundColor: label ? "#103F25" : "transparent",
          borderColor: label ? "transparent" : undefined,
        }}
      >
        <span
          ref={labelRef}
          className="px-2 text-[8px] font-medium uppercase leading-[1.5] tracking-[0.2em] text-ivory"
        >
          {label}
        </span>
      </div>
    </div>
  );
}
