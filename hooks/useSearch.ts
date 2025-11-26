"use client";

import { useState, useEffect } from "react";

export const useSearch = (query: string) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    songs: [],
    artists: [],
    playlists: [],
  });

  useEffect(() => {
    if (!query || query.length === 0) {
      setResults({ songs: [], artists: [], playlists: [] });
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error("Search failed");
        }
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ songs: [], artists: [], playlists: [] });
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return { loading, results };
};
