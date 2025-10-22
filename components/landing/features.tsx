import {
  Search,
  AudioLines,
  WifiOff,
  Sliders,
  Users,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart discovery",
    description:
      "Find new artists you'll love with context-aware recommendations.",
  },
  {
    icon: AudioLines,
    title: "Lossless + Spatial",
    description: "Studio-grade sound with immersive spatial mixing.",
  },
  {
    icon: WifiOff,
    title: "Offline mode",
    description:
      "Save playlists for flights, tunnels, and everything in between.",
  },
  {
    icon: Sliders,
    title: "Precision EQ",
    description: "Fine-tune your sound with a responsive equalizer.",
  },
  {
    icon: Users,
    title: "Live collab",
    description: "Build playlists with friends in real time, across devices.",
  },
  {
    icon: Shield,
    title: "Private by default",
    description: "Your data stays yours. End-to-end encrypted sessions.",
  },
];

export function Features() {
  return (
    <section id="features" className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Designed for pure listening
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Everything you need, nothing you don't. Powerful discovery, pristine
            audio, and effortless collaboration.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition bg-white/30 dark:bg-zinc-900/20 backdrop-blur-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
