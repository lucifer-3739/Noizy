"use client";

import { useEffect, useState } from "react";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-16 sm:mt-20 mb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
                <span className="text-[12px] font-semibold tracking-tight">
                  NZ
                </span>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                © {year} Noizy Inc.
              </span>
            </div>
            <div className="flex items-center gap-7 text-sm">
              <a
                href="#"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
              >
                Terms
              </a>
              <a
                href="https://github.com/lucifer-3739"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
              >
                <Twitter className="h-4 w-4" />X
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
