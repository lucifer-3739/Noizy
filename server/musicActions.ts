"use server";

import { db, supabase } from "@/db/drizzle";
import {
  artists,
  songs,
  playlists,
  playlistitems,
  artistsongs,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

// 🧑‍🎤 Add Artist
export const addArtist = async (name: string, country?: string) => {
  try {
    const [newArtist] = await db
      .insert(artists)
      .values({
        Name: name,
        Country: country ?? null,
      })
      .returning();

    return { success: true, artist: newArtist };
  } catch (error) {
    console.error("Add artist error:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 🎶 Add Song
export const addSong = async (
  title: string,
  artistID: number,
  duration?: number,
  fileURL?: string,
  releaseDate?: Date
) => {
  try {
    // Add song to DB
    const [newSong] = await db
      .insert(songs)
      .values({
        Title: title,
        ArtistID: artistID,
        Duration: duration ?? null,
        FileURL: fileURL ?? null,
        ReleaseDate: releaseDate ?? null,
      })
      .returning();

    // Link artist and song
    await db.insert(artistsongs).values({
      SongID: newSong.SongID,
      ArtistID: artistID,
    });

    return { success: true, song: newSong };
  } catch (error) {
    console.error("Add song error:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 🎧 Upload Song File to Supabase Storage
export const uploadSongFile = async (file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from("songs") // make sure you have a 'songs' bucket in Supabase
      .upload(`songs/${Date.now()}_${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("songs").getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Upload song error:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 📀 Create Playlist
export const createPlaylist = async (ownerID: number, name: string) => {
  try {
    const [playlist] = await db
      .insert(playlists)
      .values({
        OwnerID: ownerID,
        Name: name,
      })
      .returning();

    return { success: true, playlist };
  } catch (error) {
    console.error("Create playlist error:", error);
    return { success: false, message: (error as Error).message };
  }
};

// ➕ Add Song to Playlist
export const addSongToPlaylist = async (
  playlistID: number,
  songID: number,
  position?: number
) => {
  try {
    await db.insert(playlistitems).values({
      PlaylistID: playlistID,
      SongID: songID,
      Position: position ?? 1,
    });

    return { success: true };
  } catch (error) {
    console.error("Add song to playlist error:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 🗑 Remove Song from Playlist
export const removeSongFromPlaylist = async (
  playlistID: number,
  songID: number
) => {
  try {
    await db
      .delete(playlistitems)
      .where(
        and(
          eq(playlistitems.PlaylistID, playlistID),
          eq(playlistitems.SongID, songID)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Remove song from playlist error:", error);
    return { success: false, message: (error as Error).message };
  }
};
