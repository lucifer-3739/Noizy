"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="px-6 md:px-16 pt-24 pb-20">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Feel The
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {" "}
            Music.
          </span>
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Dive into a universe of tracks, playlists, and artists crafted just
          for your vibe.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Link
            href="/explore"
            className="px-6 py-3 rounded-xl bg-purple-600 shadow-lg shadow-purple-600/40 hover:bg-purple-700 transition"
          >
            Explore Tracks
          </Link>

          <Link
            href="/library"
            className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
          >
            Your Library
          </Link>
        </motion.div>
      </section>

      {/* Trending Playlists */}
      <section className="px-6 md:px-16 py-10">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Playlists</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="
                bg-white/10 backdrop-blur-xl border border-white/20
                p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition
              "
            >
              <div className="w-full h-36 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl" />
              <p className="mt-3 font-semibold">Playlist #{i}</p>
              <p className="text-sm text-white/60">Curated for your mood</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Added Songs */}
      <section className="px-6 md:px-16 py-10">
        <h2 className="text-2xl font-bold mb-4">🎵 Recently Added</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="
                bg-white/5 backdrop-blur-xl border border-white/10
                rounded-xl p-4 flex gap-4 items-center
              "
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg" />
              <div>
                <p className="font-semibold">Song Title #{i}</p>
                <p className="text-sm text-white/60">Unknown Artist</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artists Section */}
      <section className="px-6 md:px-16 py-10 pb-32">
        <h2 className="text-2xl font-bold mb-4">🌟 Featured Artists</h2>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.12 }}
              className="min-w-[150px] flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-600 to-purple-700" />
              <p className="mt-3 font-medium">Artist #{i}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
