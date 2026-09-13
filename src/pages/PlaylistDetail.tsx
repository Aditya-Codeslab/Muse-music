import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Music, Edit3, Trash2, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackRow';
import { formatDurationFull } from '../utils/formatters';
import { Song } from '../types';

interface PlaylistDetailProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

export const PlaylistDetail: React.FC<PlaylistDetailProps> = ({ onOpenAddToPlaylist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    playlists,
    allSongs,
    playCollection,
    updatePlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="p-8 text-center py-24 text-neutral-400">
        <Music className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
        <h2 className="text-xl font-bold text-white">Playlist not found</h2>
        <button
          onClick={() => navigate('/library')}
          className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const playlistSongs = playlist.songIds
    .map((songId) => allSongs.find((s) => s.id === songId))
    .filter((s): s is Song => Boolean(s));

  const totalDuration = playlistSongs.reduce((sum, s) => sum + s.duration, 0);

  const handleStartEdit = () => {
    setEditTitle(playlist.title);
    setEditDesc(playlist.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updatePlaylist(playlist.id, editTitle, editDesc);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      navigate('/library');
    }
  };

  return (
    <div id="playlist-detail-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-36">
      {/* Playlist Header */}
      <section className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-2">
        {/* Cover Art */}
        <div className="w-52 sm:w-60 md:w-64 aspect-square rounded-2xl overflow-hidden shadow-2xl bg-neutral-800 shrink-0 border border-white/10 flex items-center justify-center">
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-20 h-20 text-neutral-600" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#fa2d48]">
              {playlist.isUserCreated ? 'Personal Playlist' : 'Apple Music Playlist'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {playlist.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl line-clamp-2">
            {playlist.description || 'Curated tracks for your personal listening experience.'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-neutral-400">
            <span className="font-semibold text-neutral-200">
              {playlist.isUserCreated ? 'Created by You' : 'Curated by Muse Editors'}
            </span>
            <span className="text-neutral-500">•</span>
            <span>
              {playlistSongs.length} songs, {formatDurationFull(totalDuration)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {playlistSongs.length > 0 && (
              <>
                <button
                  id="playlist-play-all-btn"
                  onClick={() => playCollection(playlistSongs, 0)}
                  className="px-7 py-3 rounded-full bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-[#fa2d48]/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play All</span>
                </button>

                <button
                  id="playlist-shuffle-btn"
                  onClick={() => playCollection(playlistSongs, 0, true)}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2.5 transition-colors border border-white/10"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>
              </>
            )}

            {playlist.isUserCreated && (
              <>
                <button
                  id="edit-playlist-btn"
                  onClick={handleStartEdit}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  title="Rename Playlist"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  id="delete-playlist-btn"
                  onClick={handleDelete}
                  className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal if triggered */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161a22] border border-white/10 rounded-2xl shadow-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Edit Playlist Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:border-[#fa2d48]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:border-[#fa2d48] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#fa2d48] hover:bg-[#fc445c] text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracklist */}
      {playlistSongs.length === 0 ? (
        <div className="py-24 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          <Music className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <h3 className="text-lg font-bold text-neutral-300">This playlist is empty</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Find songs you love and add them to this playlist using the "..." button on any track.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#fa2d48] text-white text-xs font-bold shadow-md"
          >
            Find Songs to Add
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
            {playlistSongs.map((song, idx) => (
              <TrackRow
                key={`${song.id}-${idx}`}
                song={song}
                index={idx}
                showAlbum
                showCover
                contextQueue={playlistSongs}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
                onRemoveFromPlaylist={
                  playlist.isUserCreated
                    ? () => removeSongFromPlaylist(playlist.id, song.id)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
