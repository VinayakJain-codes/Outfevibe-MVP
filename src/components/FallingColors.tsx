"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ColorDrop {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  sway: boolean;
}

const HOLI_COLORS = [
  "rgba(236, 72, 153, 0.5)",   // pink
  "rgba(168, 85, 247, 0.5)",   // purple
  "rgba(59, 130, 246, 0.45)",  // blue
  "rgba(6, 182, 212, 0.45)",   // cyan
  "rgba(250, 204, 21, 0.45)",  // yellow
  "rgba(34, 197, 94, 0.4)",    // green
  "rgba(244, 63, 94, 0.45)",   // rose
  "rgba(249, 115, 22, 0.4)",   // orange
];

export default function FallingColors() {
  const [drops, setDrops] = useState<ColorDrop[]>([]);

  useEffect(() => {
    const generated: ColorDrop[] = [];
    for (let i = 0; i < 30; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 18 + 6,
        color: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
        delay: Math.random() * 12,
        duration: Math.random() * 10 + 12,
        sway: Math.random() > 0.5,
      });
    }
    setDrops(generated);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute rounded-full"
          style={{
            left: `${drop.x}%`,
            width: drop.size,
            height: drop.size,
            background: `radial-gradient(circle, ${drop.color}, transparent 70%)`,
            filter: `blur(${drop.size > 14 ? 3 : 1}px)`,
            animation: `${drop.sway ? "fall-sway" : "fall"} ${drop.duration}s ${drop.delay}s linear infinite`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: drop.delay * 0.1 }}
        />
      ))}

      {/* Static floating blobs for extra depth */}
      <div
        className="absolute top-1/4 left-1/3 w-40 h-40 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.6), transparent 70%)",
          filter: "blur(60px)",
          animation: "float-up 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-2/3 right-1/4 w-32 h-32 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent 70%)",
          filter: "blur(50px)",
          animation: "float-up 8s ease-in-out 2s infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/6 w-24 h-24 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.6), transparent 70%)",
          filter: "blur(40px)",
          animation: "float-up 7s ease-in-out 1s infinite",
        }}
      />
    </div>
  );
}
