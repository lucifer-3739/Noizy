import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import z from "zod";

// =========================================================
// AUTH TABLES (BetterAuth Compatible)
// =========================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// =========================================================
// MUSIC SYSTEM TABLES (NEW STRUCTURE)
// =========================================================

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id")
    .references(() => artists.id)
    .notNull(),
  album: text("album"),
  duration: integer("duration").notNull(), // seconds
  storageKey: text("storage_key").notNull(), // MinIO file key
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id").references(() => users.id), // optional
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlistItems = pgTable("playlist_items", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id")
    .references(() => playlists.id, { onDelete: "cascade" })
    .notNull(),
  songId: integer("song_id")
    .references(() => songs.id)
    .notNull(),
  position: integer("position").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

// =========================================================
// RELATIONS
// =========================================================

export const songsRelations = relations(songs, ({ one }) => ({
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id],
  }),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  songs: many(songs),
}));

export const playlistsRelations = relations(playlists, ({ many }) => ({
  items: many(playlistItems),
}));

export const playlistItemsRelations = relations(playlistItems, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistItems.playlistId],
    references: [playlists.id],
  }),
  song: one(songs, {
    fields: [playlistItems.songId],
    references: [songs.id],
  }),
}));

// =========================================================
// upload Song
// =========================================================
const UploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist name is required"),
  audio: z.any().refine((val) => val && typeof val.arrayBuffer === "function", {
    message: "Audio file is required",
  }),
  cover: z.any().refine((val) => val && typeof val.arrayBuffer === "function", {
    message: "Cover image is required",
  }),
  duration: z.number().int().positive("Duration must be positive"),
  album: z.string().optional().nullable(),
});

// =========================================================
// EXPORT ALL
// =========================================================

export const schema = {
  users,
  session,
  account,
  verification,
  artists,
  songs,
  playlists,
  playlistItems,
  UploadSchema,
};
