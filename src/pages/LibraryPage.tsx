import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  LayoutGrid,
  List,
  Heart,
  Music,
  Disc3,
  User,
  ListMusic,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Card } from '../components/Card';
import { TrackRow } from '../components/TrackRow';
import { Song } from '../types';

interface LibraryPageProps {
  onOpenCreatePlaylist: () => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onOpenCreatePlaylist,
  onOpenAddToPlaylist,
}) => {
  const navigate = useNavigate();
  const {
    playlists,
    likedSongIds,
    allSongs,
    albums,
    artists,
    playCollection,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'artists' | 'albums'>('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const likedSongs = likedSongIds
    .map((id) => allSongs.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s));

  return (
    <div id="library-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-36">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Your Library
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {playlists.length} playlists • {likedSongIds.length} liked tracks • {albums.length} saved albums
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              id="library-grid-toggle"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="library-list-toggle"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Playlist Button */}
          <button
            id="library-new-playlist-btn"
            onClick={onOpenCreatePlaylist}
            className="px-4 py-2 rounded-xl bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#fa2d48]/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-white/10">
        <button
          onClick={() => setActiveTab('playlists')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'playlists'
              ? 'border-[#fa2d48] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Playlists ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'liked'
              ? 'border-[#fa2d48] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-[#fa2d48]" />
          <span>Liked Songs ({likedSongIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'albums'
              ? 'border-[#fa2d48] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>Albums ({albums.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'artists'
              ? 'border-[#fa2d48] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Artists ({artists.length})</span>
        </button>
      </div>

      {/* Tab: Playlists */}
      {activeTab === 'playlists' && (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Liked Songs Special Card */}
              <div
                onClick={() => navigate('/liked')}
                className="group relative flex flex-col cursor-pointer transition-all shrink-0"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-800 via-[#fa2d48] to-amber-500 shadow-xl flex items-center justify-center transition-transform group-hover:-translate-y-1">
                  <Heart className="w-16 h-16 text-white fill-white shadow-2xl" />
                </div>
                <div className="mt-2.5 px-0.5">
                  <h4 className="text-sm font-bold text-white truncate">Liked Songs</h4>
                  <p className="text-xs text-neutral-400">{likedSongIds.length} tracks</p>
                </div>
              </div>

              {/* All Playlists */}
              {playlists.map((pl) => {
                const plSongs = allSongs.filter((s) => pl.songIds.includes(s.id));
                return (
                  <Card
                    key={pl.id}
                    id={`library-pl-${pl.id}`}
                    title={pl.title}
                    subtitle={`${pl.songIds.length} songs`}
                    imageUrl={pl.coverUrl}
                    onClick={() => navigate(`/playlist/${pl.id}`)}
                    onPlayClick={() => playCollection(plSongs, 0)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-white/5 bg-[#141822]/60 rounded-2xl border border-white/5 p-2">
              <div
                onClick={() => navigate('/liked')}
                className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#fa2d48] to-purple-800 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">Liked Songs</h4>
                  <p className="text-xs text-neutral-400">Auto-generated playlist</p>
                </div>
                <div className="text-xs text-neutral-400 font-medium">
                  {likedSongIds.length} tracks
                </div>
              </div>

              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                    {pl.coverUrl ? (
                      <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-6 h-6 text-neutral-500 m-auto mt-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
                    <p className="text-xs text-neutral-400 truncate">{pl.description || 'Playlist'}</p>
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">
                    {pl.songIds.length} tracks
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Liked Songs */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          {likedSongs.length === 0 ? (
            <div className="py-20 text-center bg-white/[0.02] rounded-2xl border border-white/5">
              <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No liked songs yet</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Tap the heart icon on any track to add it to your Liked Songs collection.
              </p>
            </div>
          ) : (
            <div className="bg-[#141822]/60 border border-white/5 rounded-2xl p-2 divide-y divide-white/5">
              {likedSongs.map((song, idx) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={idx}
                  contextQueue={likedSongs}
                  onOpenAddToPlaylist={onOpenAddToPlaylist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Albums */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.map((album) => {
            const albSongs = allSongs.filter((s) => album.songIds.includes(s.id));
            return (
              <Card
                key={album.id}
                id={`lib-album-${album.id}`}
                title={album.title}
                subtitle={`${album.artist} • ${album.releaseYear}`}
                imageUrl={album.coverUrl}
                onClick={() => navigate(`/album/${album.id}`)}
                onPlayClick={() => playCollection(albSongs, 0)}
              />
            );
          })}
        </div>
      )}

      {/* Tab: Artists */}
      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artists.map((artist) => {
            const artistSongs = allSongs.filter((s) => artist.topSongIds.includes(s.id));
            return (
              <Card
                key={artist.id}
                id={`lib-artist-${artist.id}`}
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
      )}
    </div>
  );
};
