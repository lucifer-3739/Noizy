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
    <div className="w-full h-full relative flex flex-col items-center overflow-x-hidden">
      <div className="relative w-full h-[380px] flex flex-col justify-center items-center overflow-hidden shrink-0">
        <div
          className="absolute inset-0 -z-10 transition-all duration-100 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(1)`,
          }}
        >
          <HomepageBackground />
        </div>
        <h1 className="relative z-10 text-white font-aerosoldis text-5xl sm:text-7xl md:text-9xl font-extrabold tracking-widest text-center px-4">
          AUDIOWAVE
        </h1>

        <p className="relative z-10 text-white/80 font-caveat italic text-2xl sm:text-4xl mt-2 text-center px-4">
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
