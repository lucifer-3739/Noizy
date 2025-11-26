"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const { loading, results } = useSearch(input);

  return (
    <div className="p-4 w-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 rounded-xl bg-neutral-900 text-white outline-none"
        placeholder="Search songs, artists, playlists..."
      />

      {loading && <p className="text-gray-500 mt-2">Searching...</p>}

      <div className="mt-4 text-white space-y-6">
        {/* Songs */}
        {results.songs.length > 0 && (
          <div>
            <h3 className="font-bold">Songs</h3>
            {results.songs.map((s: any) => (
              <p key={s.id}>{s.title}</p>
            ))}
          </div>
        )}

        {/* Artists */}
        {results.artists.length > 0 && (
          <div>
            <h3 className="font-bold">Artists</h3>
            {results.artists.map((a: any) => (
              <p key={a.id}>{a.name}</p>
            ))}
          </div>
        )}

        {/* Playlists */}
        {results.playlists.length > 0 && (
          <div>
            <h3 className="font-bold">Playlists</h3>
            {results.playlists.map((p: any) => (
              <p key={p.id}>{p.name}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
