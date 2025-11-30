"use client";

import { useEffect, useState } from "react";
import "./globals.css";

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotate: number;
  opacity: number;
}

const COLORS = [
  "#00f6ff",
  "#ff2f92",
  "#7b5dff",
  "#00ff85",
  "#ffdb00",
  "#ff6b00",
];

export default function HomepageBackground() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const generated: Shape[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 20,
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.6 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    setShapes(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08080f]">
      {/* tiny star noise */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[length:3px_3px] opacity-10"></div>

      {/* glitchy shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute animate-glitch-shiver"
          style={{
            top: `${shape.y}%`,
            left: `${shape.x}%`,
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotate}deg)`,
            clipPath:
              Math.random() > 0.5
                ? `polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)`
                : `polygon(10% 0%, 100% 20%, 90% 100%, 0% 80%)`,
            filter: "blur(2px)",
          }}
        ></div>
      ))}

      {/* RGB glitch overlay */}
      <div className="absolute inset-0 mix-blend-screen opacity-20">
        <div className="absolute inset-0 animate-glitch-r"></div>
        <div className="absolute inset-0 animate-glitch-g"></div>
        <div className="absolute inset-0 animate-glitch-b"></div>
      </div>
    </div>
  );
}
