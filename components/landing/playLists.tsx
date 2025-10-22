"use client";

import { useState, useEffect, useRef } from "react";
import { Wand2 } from "lucide-react";

const playlists = [
  {
    title: "Sunset Drive",
    genre: "Synthwave • Chill",
    img: "https://www.shutterbug.com/images/styles/960-wide/public/photo_post/[uid]/Sunset%20Drive.jpg",
  },
  {
    title: "Beats & Focus",
    genre: "Lo-fi • Deep work",
    img: "https://i.pinimg.com/originals/ad/6d/eb/ad6debae9df150ed888e00acada08a19.jpg",
  },
  {
    title: "Night Pulse",
    genre: "House • Future",
    img: "https://i.ytimg.com/vi/ytlqHW4pDo4/maxresdefault.jpg",
  },
  {
    title: "Acoustic Morning",
    genre: "Indie • Coffee",
    img: "https://tse3.mm.bing.net/th/id/OIP.YpQ8IWjwtIT0qMO4xUefsQHaEK?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];

export function Playlists() {
  const [tilts, setTilts] = useState<Record<number, { x: number; y: number }>>(
    {}
  );
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (index: number) => (e: MouseEvent) => {
      const ref = cardRefs.current[index];
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      setTilts((prev) => ({ ...prev, [index]: { x: -py * 6, y: px * 6 } }));
    };

    const handleMouseLeave = (index: number) => () => {
      setTilts((prev) => ({ ...prev, [index]: { x: 0, y: 0 } }));
    };

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener("mousemove", handleMouseMove(index));
        ref.addEventListener("mouseleave", handleMouseLeave(index));
      }
    });

    return () => {
      cardRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener("mousemove", handleMouseMove(index));
          ref.removeEventListener("mouseleave", handleMouseLeave(index));
        }
      });
    };
  }, []);

  return (
    <section id="playlists" className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Curated for your vibe
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Hand-picked mixes to match your moment.
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm hover:bg-white/50 dark:hover:bg-zinc-900/50 backdrop-blur transition"
          >
            <Wand2 className="h-4 w-4" />
            Refresh recommendations
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {playlists.map((playlist, index) => (
            <a
              key={playlist.title}
              href="#"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-lg shadow-black/10"
              style={{
                perspective: "1200px",
                transform: `rotateX(${tilts[index]?.x || 0}deg) rotateY(${
                  tilts[index]?.y || 0
                }deg)`,
                transformStyle: "preserve-3d",
                transitionDuration: "300ms",
              }}
            >
              <img
                src={`${playlist.img}`}
                alt={`Playlist - ${playlist.title}`}
                className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-base font-semibold tracking-tight">
                  {playlist.title}
                </h3>
                <p className="text-xs text-zinc-300">{playlist.genre}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
