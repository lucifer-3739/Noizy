"use client";

import {
  Home,
  Search,
  Star,
  Mic,
  Settings,
  MoreVertical,
  Plus,
  Music,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPlaylists } from "@/server/Songs";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Playlist } from "@/types";
import { useMusicPlayer } from "./songsplayer/MusicPlayerContext";

interface MenuItem {
  id: string;
  label: string;
  icon: "home" | "search" | "artists" | "podcast" | "upload";
  path?: string; // 👈 OPTIONAL
}

const iconMap = {
  home: Home,
  search: Search,
  upload: Upload,
  artists: Star,
  podcast: Mic,
};

export function MusicSidebar() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { openUpload, overlay } = useMusicPlayer();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuItems([
      { id: "1", label: "Home", icon: "home", path: "/dashboard" },
      { id: "2", label: "Search", icon: "search", path: "/dashboard/search" },

      // 🚫 Upload is NOT a route anymore
      { id: "3", label: "Upload", icon: "upload" },

      {
        id: "4",
        label: "Artists",
        icon: "artists",
        path: "/dashboard/artists",
      },
      {
        id: "5",
        label: "Podcast",
        icon: "podcast",
        path: "/dashboard/podcast",
      },
    ]);

    const loadPlaylists = async () => {
      const res = await fetchPlaylists();
      if (res.success) {
        setPlaylists(
          res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description ?? "",
            coverUrl: p.coverUrl ?? "",
          }))
        );
      }
      setIsLoading(false);
    };

    loadPlaylists();
  }, []);

  return (
    <aside className="w-64 bg-[#0a0a0a] text-white border-r border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <Link href="/">Noizy</Link>
        </h1>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        {/* Menu */}
        <div className="space-y-1 mb-6">
          <p className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">
            Menu
          </p>

          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];

            const isActive = item.path && pathname === item.path;

            const isUploadOpen = item.icon === "upload" && overlay === "upload";

            return (
              <Button
                key={item.id}
                onClick={() => {
                  if (item.icon === "upload") {
                    openUpload(); // ✅ ONLY THIS
                  } else if (item.path) {
                    router.push(item.path);
                  }
                }}
                variant="ghost"
                className={`
                  w-full justify-start gap-3
                  text-gray-300 hover:text-white hover:bg-gray-800/50
                  ${isActive || isUploadOpen ? "bg-gray-800/80 text-white" : ""}
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        <Separator className="bg-gray-800 mb-6" />

        {/* Library */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Library
            </p>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Loading playlists...
            </div>
          ) : (
            playlists.map((p) => (
              <Button
                key={p.id}
                onClick={() => router.push(`/dashboard/playlist/${p.id}`)}
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                <Music className="h-5 w-5" />
                <span className="truncate">{p.name}</span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <Button
          onClick={() => router.push("/dashboard/settings")}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>
    </aside>
  );
}
