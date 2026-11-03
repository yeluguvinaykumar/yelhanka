"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  strength = 40,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-[-8%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClassName ?? "object-cover"}
        />
      </motion.div>
    </div>
  );
}
