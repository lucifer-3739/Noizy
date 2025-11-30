"use client";

import HomePage from "@/components/dashboard/home/Homepage";
import HomepageBackground from "@/components/dashboard/home/HomepageBackground";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // depth
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="relative w-full h-[380px] flex flex-col justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10 transition-all duration-100 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(1)`,
          }}
        >
          <HomepageBackground />
        </div>
        <h1 className="text-white font-lemon text-9xl sm:text-12xl font-extrabold tracking-widest">
          AUDIOWAVE
        </h1>

        <p className="text-white/80 font-caveat italic text-5xl sm:text-6xl mt-2">
          YOUR SOUNDTRACK TO NOW
        </p>
      </div>
      <div className="w-full flex justify-center mt-6 mb-10">
        <div className="w-full h-0.5 bg-white/20" />
      </div>
      <HomePage />
    </div>
  );
}
