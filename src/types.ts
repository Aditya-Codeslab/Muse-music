export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  liked?: boolean;
  plays?: number;
  genre?: string;
  lyrics?: { time: number; text: string }[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  songIds: string[];
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  genre: string;
  monthlyListeners: string;
  topSongIds: string[];
  albumIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  isUserCreated?: boolean;
  createdAt?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
