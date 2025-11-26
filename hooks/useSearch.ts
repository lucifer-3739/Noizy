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

      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      setResults(data);
      setLoading(false);
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return { loading, results };
};
