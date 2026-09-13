import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Sparkles, Disc, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackRow';
import { formatDurationFull } from '../utils/formatters';
import { Song } from '../types';

interface AlbumDetailProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

export const AlbumDetail: React.FC<AlbumDetailProps> = ({ onOpenAddToPlaylist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { albums, allSongs, playCollection } = usePlayer();

  const album = albums.find((a) => a.id === id) || albums[0];
  const albumSongs = allSongs.filter((s) => album.songIds.includes(s.id));

  const totalDuration = albumSongs.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div id="album-detail-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-36">
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-2">
        {/* Cover Art */}
        <div className="w-52 sm:w-60 md:w-64 aspect-square rounded-2xl overflow-hidden shadow-2xl bg-neutral-800 shrink-0 border border-white/10">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#fa2d48]">
              Album
            </span>
            <span className="text-neutral-500">•</span>
            <div className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <Sparkles className="w-3 h-3 text-[#fa2d48]" />
              Spatial Audio
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-neutral-300">
            <span
              className="font-bold text-white hover:underline cursor-pointer"
              onClick={() => navigate(`/artist/${album.artistId}`)}
            >
              {album.artist}
            </span>
            <span className="text-neutral-500">•</span>
            <span>{album.releaseYear}</span>
            <span className="text-neutral-500">•</span>
            <span>{album.genre}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">
              {albumSongs.length} songs, {formatDurationFull(totalDuration)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              id="album-play-all-btn"
              onClick={() => playCollection(albumSongs, 0)}
              className="px-7 py-3 rounded-full bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-[#fa2d48]/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play All</span>
            </button>

            <button
              id="album-shuffle-btn"
              onClick={() => playCollection(albumSongs, 0, true)}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2.5 transition-colors border border-white/10"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Note */}
      {album.description && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Editor's Notes
          </p>
          {album.description}
        </div>
      )}

      {/* Track List Section */}
      <section className="space-y-2">
        {/* Table Header */}
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-neutral-500 border-b border-white/10 select-none">
          <div className="w-7 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-12 text-right flex justify-end">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="w-6" />
        </div>

        {/* Tracks */}
        <div className="space-y-0.5">
          {albumSongs.map((song, idx) => (
            <TrackRow
              key={song.id}
              song={song}
              index={idx}
              showAlbum={false}
              showCover={false}
              contextQueue={albumSongs}
              onOpenAddToPlaylist={onOpenAddToPlaylist}
            />
          ))}
        </div>
      </section>

      {/* Copyright info */}
      <div className="pt-8 border-t border-white/5 text-xs text-neutral-500 space-y-1">
        <p>© {album.releaseYear} Muse Music Master Recordings. All rights reserved.</p>
        <p>Available in Apple Lossless Audio and Dolby Atmos.</p>
      </div>
    </div>
  );
};
