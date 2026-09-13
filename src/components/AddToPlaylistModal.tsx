import React, { useState } from 'react';
import { X, Plus, Check, Music } from 'lucide-react';
import { Song, Playlist } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface AddToPlaylistModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  song,
  isOpen,
  onClose,
  onOpenCreatePlaylist,
}) => {
  const { playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlayer();
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!isOpen || !song) return null;

  const handleToggle = (playlist: Playlist) => {
    const isAlreadyIn = playlist.songIds.includes(song.id);
    if (isAlreadyIn) {
      removeSongFromPlaylist(playlist.id, song.id);
    } else {
      addSongToPlaylist(playlist.id, song.id);
      setSuccessId(playlist.id);
      setTimeout(() => setSuccessId(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="add-to-playlist-modal"
        className="w-full max-w-md bg-[#161a22] border border-white/10 rounded-2xl shadow-2xl p-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold truncate">{song.title}</h3>
              <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: Create New Playlist */}
        <button
          id="modal-create-playlist-btn"
          onClick={() => {
            onClose();
            onOpenCreatePlaylist();
          }}
          className="w-full mt-4 p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/5 flex items-center gap-3 transition-colors text-left font-medium text-sm text-[#fa2d48]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fa2d48]/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#fa2d48]" />
          </div>
          <span>New Playlist</span>
        </button>

        {/* Playlists List */}
        <div className="mt-3 max-h-60 overflow-y-auto space-y-1.5 pr-1">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1 pt-1 mb-2">
            Your Playlists
          </p>

          {playlists.map((pl) => {
            const hasSong = pl.songIds.includes(song.id);
            return (
              <button
                key={pl.id}
                id={`add-to-pl-${pl.id}`}
                onClick={() => handleToggle(pl)}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-800 shrink-0 flex items-center justify-center">
                    {pl.coverUrl ? (
                      <img
                        src={pl.coverUrl}
                        alt={pl.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-200 group-hover:text-white truncate">
                      {pl.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {pl.songIds.length} tracks
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {hasSong ? (
                    <span className="w-6 h-6 rounded-full bg-[#fa2d48] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : successId === pl.id ? (
                    <span className="text-xs text-green-400 font-semibold">Added!</span>
                  ) : (
                    <Plus className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
