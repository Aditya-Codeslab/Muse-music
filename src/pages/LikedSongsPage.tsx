import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Shuffle, Search, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackRow';
import { formatDurationFull } from '../utils/formatters';
import { Song } from '../types';

interface LikedSongsPageProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

export const LikedSongsPage: React.FC<LikedSongsPageProps> = ({ onOpenAddToPlaylist }) => {
  const navigate = useNavigate();
  const { likedSongIds, allSongs, playCollection } = usePlayer();
  const [filterQuery, setFilterQuery] = useState('');

  const likedSongs = useMemo(() => {
    return likedSongIds
      .map((id) => allSongs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));
  }, [likedSongIds, allSongs]);

  const filteredLikedSongs = useMemo(() => {
    if (!filterQuery.trim()) return likedSongs;
    const q = filterQuery.toLowerCase();
    return likedSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
    );
  }, [likedSongs, filterQuery]);

  const totalDuration = likedSongs.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div id="liked-songs-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-36">
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-2">
        {/* Heart Emblem Card */}
        <div className="w-52 sm:w-60 aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-purple-900 via-[#fa2d48] to-orange-500 shrink-0 flex items-center justify-center border border-white/10">
          <Heart className="w-24 h-24 text-white fill-white shadow-2xl" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-[#fa2d48]">
            Auto-Playlist
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Liked Songs
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400">
            {likedSongs.length} favorites • {formatDurationFull(totalDuration)}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {likedSongs.length > 0 && (
              <>
                <button
                  id="liked-play-all-btn"
                  onClick={() => playCollection(likedSongs, 0)}
                  className="px-7 py-3 rounded-full bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-[#fa2d48]/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play All</span>
                </button>

                <button
                  id="liked-shuffle-btn"
                  onClick={() => playCollection(likedSongs, 0, true)}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2.5 transition-colors border border-white/10"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Filter within Liked Songs */}
      {likedSongs.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter in Liked Songs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#fa2d48]"
            />
          </div>

          <span className="text-xs text-neutral-400">
            Showing {filteredLikedSongs.length} of {likedSongs.length}
          </span>
        </div>
      )}

      {/* Track List */}
      {likedSongs.length === 0 ? (
        <div className="py-24 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          <Heart className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <h3 className="text-lg font-bold text-neutral-300">Your liked songs list is empty</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Click the heart button on any song in the app to collect your favorite tracks here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#fa2d48] text-white text-xs font-bold shadow-md"
          >
            Explore Music
          </button>
        </div>
      ) : (
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-neutral-500 border-b border-white/10 select-none">
            <div className="w-7 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="hidden md:block flex-1">Album</div>
            <div className="w-12 text-right flex justify-end">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="w-6" />
          </div>

          <div className="space-y-0.5">
            {filteredLikedSongs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                showAlbum
                showCover
                contextQueue={filteredLikedSongs}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
