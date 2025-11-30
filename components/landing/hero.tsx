"use client";

import { useState, useEffect, useRef } from "react";
import {
  Headphones,
  Play,
  ShieldCheck,
  Sparkles,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import LaserFlow from "../LaserFlow";

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      setTilt({ x: -py * 6, y: px * 6 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    const element = cardRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <section className="relative overflow-hidden h-screen flex flex-col w-screen justify-center">
      {/* Laser background */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center">
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={-0.07}
          color="#7C3AED"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mx-auto w-full max-w-7xl px-6 lg:px-16">

        <div className="text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/30 backdrop-blur px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 mb-6 shadow-sm">
            <span className="text-indigo-500">🎵</span>
            Feel every beat, anywhere
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
            No noise. Just{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-indigo-400">
              noizy
            </span>
            .
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            A beautifully minimal music experience. Discover new artists, stream
            in lossless quality, and craft playlists with friends in real time.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-500 active:bg-indigo-600/90 transition shadow-lg shadow-indigo-600/30"
            >
              <Headphones className="h-4 w-4" />
              Start listening
            </a>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur px-5 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition shadow-sm"
            >
              <Play className="h-4 w-4" />
              Watch demo
            </a>
            <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Privacy-first</span>
              </div>
              <span className="h-3 w-px bg-zinc-300/70 dark:bg-zinc-700/70"></span>
              <div className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Lossless + Spatial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Preview Card */}
      <div
        id="preview"
        className="relative mt-16 flex justify-center w-full p-2"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={cardRef}
          className="relative w-full max-w-7xl rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/25 dark:bg-zinc-900/20 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/10 transition-transform duration-300"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Player top */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src="https://i.scdn.co/image/ab67616d00001e02711c1639b4bc0f9978ae77a6"
                alt="Album cover"
                className="h-24 w-24 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  Sanam Teri Kasam
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Himesh Reshammiya
                </p>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 overflow-hidden">
                    <div className="h-full w-2/3 bg-indigo-500 rounded-full"></div>
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>01:24</span>
                    <span>05:14</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5">
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-white/50 dark:hover:bg-zinc-800/50 backdrop-blur transition">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition">
                  <Play className="h-5 w-5" />
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-white/50 dark:hover:bg-zinc-800/50 backdrop-blur transition">
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Volume2 className="h-4 w-4" />
                <div className="h-1.5 w-24 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 overflow-hidden">
                  <div className="h-full w-2/3 bg-zinc-500 dark:bg-zinc-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini queue */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Neon Bloom", artist: "Kyra Wave", img: "neon-bloom" },
              { title: "Glass Hearts", artist: "Clyde Z", img: "glass-hearts" },
              { title: "Satellite", artist: "Ari Nova", img: "satellite" },
            ].map((track) => (
              <div
                key={track.title}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 hover:bg-white/50 dark:hover:bg-zinc-900/50 backdrop-blur transition"
              >
                <img
                  src={`/tracks/${track.img}.jpg`}
                  alt={track.title}
                  className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating badge */}
        {/* <div className="hidden sm:flex absolute -top-4 right-8 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 backdrop-blur px-3 py-2 shadow-sm">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-xs text-zinc-700 dark:text-zinc-300">
            Spatial Mix enabled
          </span>
        </div> */}
      </div>
    </section>
  );
}
