import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Music, Disc, User, ListMusic, Sparkles } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackRow';
import { Card } from '../components/Card';
import { Song } from '../types';

interface SearchPageProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

const GENRE_CATEGORIES = [
  { name: 'Pop', color: 'from-pink-600 to-rose-900', query: 'Pop' },
  { name: 'Electronic / Dance', color: 'from-cyan-600 to-blue-900', query: 'Dance' },
  { name: 'Neo-Soul & R&B', color: 'from-amber-600 to-orange-950', query: 'Soul' },
  { name: 'Indie & Folk', color: 'from-emerald-600 to-teal-950', query: 'Folk' },
  { name: 'Synthwave', color: 'from-purple-600 to-indigo-950', query: 'Synthwave' },
  { name: 'Ambient & Spatial', color: 'from-blue-700 to-slate-950', query: 'Ambient' },
  { name: 'Latin Pop', color: 'from-red-600 to-rose-950', query: 'Latin' },
  { name: 'Modern Classical', color: 'from-yellow-700 to-stone-900', query: 'Classical' },
  { name: 'Alternative Rock', color: 'from-stone-600 to-zinc-900', query: 'Rock' },
];

export const SearchPage: React.FC<SearchPageProps> = ({ onOpenAddToPlaylist }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allSongs, albums, artists, playlists, playCollection } = usePlayer();

  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'albums' | 'artists' | 'playlists'>('all');

  const normalizedQuery = query.toLowerCase().trim();

  // Filtered results
  const filteredSongs = useMemo(() => {
    if (!normalizedQuery) return [];
    return allSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(normalizedQuery) ||
        s.artist.toLowerCase().includes(normalizedQuery) ||
        s.album.toLowerCase().includes(normalizedQuery) ||
        (s.genre && s.genre.toLowerCase().includes(normalizedQuery))
    );
  }, [allSongs, normalizedQuery]);

  const filteredAlbums = useMemo(() => {
    if (!normalizedQuery) return [];
    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(normalizedQuery) ||
        a.artist.toLowerCase().includes(normalizedQuery) ||
        a.genre.toLowerCase().includes(normalizedQuery)
    );
  }, [albums, normalizedQuery]);

  const filteredArtists = useMemo(() => {
    if (!normalizedQuery) return [];
    return artists.filter(
      (ar) =>
        ar.name.toLowerCase().includes(normalizedQuery) ||
        ar.genre.toLowerCase().includes(normalizedQuery)
    );
  }, [artists, normalizedQuery]);

  const filteredPlaylists = useMemo(() => {
    if (!normalizedQuery) return [];
    return playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery)
    );
  }, [playlists, normalizedQuery]);

  const totalResults =
    filteredSongs.length +
    filteredAlbums.length +
    filteredArtists.length +
    filteredPlaylists.length;

  return (
    <div id="search-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Find tracks, albums, artists, or browse categories
        </p>
      </div>

      {/* Filter Tabs when query is present */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['all', 'songs', 'albums', 'artists', 'playlists'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors shrink-0 ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Empty Query: Browse Genres & Categories */}
      {!query && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fa2d48]" />
            Browse Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRE_CATEGORIES.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchParams({ q: genre.query })}
                className={`h-28 sm:h-32 rounded-2xl p-4 bg-gradient-to-br ${genre.color} shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between group overflow-hidden relative`}
              >
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 blur-md pointer-events-none group-hover:scale-150 transition-transform" />
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {genre.name}
                </h3>
                <span className="text-[11px] font-semibold text-white/80">Explore Genre →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {query && totalResults === 0 && (
        <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
          <Search className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-300">No results found for "{query}"</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Please check your spelling, or try searching for another artist, song, or genre.
          </p>
        </div>
      )}

      {/* Songs Results */}
      {query && (activeTab === 'all' || activeTab === 'songs') && filteredSongs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-[#fa2d48]" />
              Songs ({filteredSongs.length})
            </h2>
            {filteredSongs.length > 0 && (
              <button
                onClick={() => playCollection(filteredSongs, 0)}
                className="text-xs font-semibold text-[#fa2d48] hover:text-[#fc5c70]"
              >
                Play All
              </button>
            )}
          </div>

          <div className="bg-[#141822]/60 border border-white/5 rounded-2xl p-2 divide-y divide-white/5">
            {filteredSongs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                contextQueue={filteredSongs}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Albums Results */}
      {query && (activeTab === 'all' || activeTab === 'albums') && filteredAlbums.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-[#fa2d48]" />
            Albums ({filteredAlbums.length})
          </h2>

          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
            {filteredAlbums.map((album) => {
              const albumSongs = allSongs.filter((s) => album.songIds.includes(s.id));
              return (
                <Card
                  key={album.id}
                  id={`search-album-${album.id}`}
                  title={album.title}
                  subtitle={album.artist}
                  imageUrl={album.coverUrl}
                  badge={album.genre}
                  onClick={() => navigate(`/album/${album.id}`)}
                  onPlayClick={() => playCollection(albumSongs, 0)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Artists Results */}
      {query && (activeTab === 'all' || activeTab === 'artists') && filteredArtists.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#fa2d48]" />
            Artists ({filteredArtists.length})
          </h2>

          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
            {filteredArtists.map((artist) => {
              const artistSongs = allSongs.filter((s) => artist.topSongIds.includes(s.id));
              return (
                <Card
                  key={artist.id}
                  id={`search-artist-${artist.id}`}
                  title={artist.name}
                  subtitle={artist.genre}
                  imageUrl={artist.imageUrl}
                  isCircle
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  onPlayClick={() => playCollection(artistSongs, 0)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Playlists Results */}
      {query && (activeTab === 'all' || activeTab === 'playlists') && filteredPlaylists.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#fa2d48]" />
            Playlists ({filteredPlaylists.length})
          </h2>

          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
            {filteredPlaylists.map((pl) => {
              const plSongs = allSongs.filter((s) => pl.songIds.includes(s.id));
              return (
                <Card
                  key={pl.id}
                  id={`search-playlist-${pl.id}`}
                  title={pl.title}
                  subtitle={pl.description}
                  imageUrl={pl.coverUrl}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  onPlayClick={() => playCollection(plSongs, 0)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
