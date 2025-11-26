export interface Artist {
  id: number;
  name: string;
  bio: string | null;
  imageUrl: string | null;
}

export interface Song {
  id: number;
  title: string;
  artistId: number;
  artist?: Artist;
  album: string | null;
  duration: number;
  coverUrl: string | null;
  storageKey: string;
}

export interface Playlist {
  id: number;
  name: string;
  description: string | null;
  coverUrl: string | null;
}
