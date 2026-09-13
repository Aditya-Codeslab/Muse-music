import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, MoreHorizontal, ListPlus, Music, Disc, User, Trash2 } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatters';

interface TrackRowProps {
  song: Song;
  index: number;
  showAlbum?: boolean;
  showCover?: boolean;
  contextQueue?: Song[];
  onRemoveFromPlaylist?: () => void;
  onOpenAddToPlaylist?: (song: Song) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  song,
  index,
  showAlbum = true,
  showCover = true,
  contextQueue,
  onRemoveFromPlaylist,
  onOpenAddToPlaylist,
}) => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    isLiked,
    addToQueue,
  } = usePlayer();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCurrent = currentTrack?.id === song.id;
  const liked = isLiked(song.id);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(song, contextQueue);
    }
  };

  return (
    <div
      id={`track-row-${song.id}`}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 cursor-pointer select-none ${
        isCurrent
          ? 'bg-white/10 text-white font-medium'
          : 'hover:bg-white/[0.06] text-neutral-300 hover:text-white'
      }`}
      onClick={handleRowClick}
    >
      {/* Track number / Play State */}
      <div className="w-7 flex items-center justify-center text-xs font-semibold text-neutral-400">
        {isCurrent && isPlaying ? (
          <div className="flex items-end gap-[2px] h-4">
            <span className="w-1 bg-[#fa2d48] animate-[bounce_0.8s_infinite] h-3 rounded-full" />
            <span className="w-1 bg-[#fa2d48] animate-[bounce_1.1s_infinite_0.2s] h-4 rounded-full" />
            <span className="w-1 bg-[#fa2d48] animate-[bounce_0.7s_infinite_0.4s] h-2 rounded-full" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <button
              id={`play-track-btn-${song.id}`}
              className="hidden group-hover:flex items-center justify-center text-white transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick();
              }}
            >
              {isCurrent && isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Cover Image (optional) */}
      {showCover && (
        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-800 shrink-0 shadow-sm">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <p
          className={`text-sm truncate font-medium ${
            isCurrent ? 'text-[#fa2d48]' : 'text-neutral-100 group-hover:text-white'
          }`}
        >
          {song.title}
        </p>
        <p
          className="text-xs text-neutral-400 truncate hover:underline hover:text-neutral-200 mt-0.5"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artist/${song.artistId}`);
          }}
        >
          {song.artist}
        </p>
      </div>

      {/* Album (optional) */}
      {showAlbum && (
        <div
          className="hidden md:block flex-1 min-w-0 text-xs text-neutral-400 truncate hover:underline hover:text-neutral-200"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/album/${song.albumId}`);
          }}
        >
          {song.album}
        </div>
      )}

      {/* Like Heart button */}
      <button
        id={`like-track-btn-${song.id}`}
        className={`p-1.5 rounded-full transition-colors ${
          liked
            ? 'text-[#fa2d48] opacity-100'
            : 'text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(song.id);
        }}
        title={liked ? 'Remove from Liked' : 'Add to Liked'}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-[#fa2d48]' : ''}`} />
      </button>

      {/* Duration */}
      <div className="text-xs text-neutral-400 w-12 text-right tabular-nums">
        {formatTime(song.duration)}
      </div>

      {/* Context Menu Button */}
      <div className="relative" ref={menuRef}>
        <button
          id={`context-track-btn-${song.id}`}
          className="p-1 text-neutral-400 hover:text-white rounded-md transition-opacity opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            className="absolute right-0 top-7 z-50 w-52 bg-[#1c202a] border border-white/10 rounded-xl shadow-2xl py-1.5 text-xs text-neutral-200 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id={`menu-play-next-${song.id}`}
              className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              onClick={() => {
                addToQueue(song, true);
                setIsMenuOpen(false);
              }}
            >
              <Play className="w-3.5 h-3.5 text-neutral-400" />
              <span>Play Next</span>
            </button>

            <button
              id={`menu-add-queue-${song.id}`}
              className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              onClick={() => {
                addToQueue(song, false);
                setIsMenuOpen(false);
              }}
            >
              <ListPlus className="w-3.5 h-3.5 text-neutral-400" />
              <span>Add to Queue</span>
            </button>

            <button
              id={`menu-add-playlist-${song.id}`}
              className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenAddToPlaylist) {
                  onOpenAddToPlaylist(song);
                }
              }}
            >
              <Music className="w-3.5 h-3.5 text-neutral-400" />
              <span>Add to Playlist...</span>
            </button>

            <div className="h-px bg-white/10 my-1" />

            <button
              id={`menu-go-album-${song.id}`}
              className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                navigate(`/album/${song.albumId}`);
              }}
            >
              <Disc className="w-3.5 h-3.5 text-neutral-400" />
              <span>Go to Album</span>
            </button>

            <button
              id={`menu-go-artist-${song.id}`}
              className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                navigate(`/artist/${song.artistId}`);
              }}
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Go to Artist</span>
            </button>

            {onRemoveFromPlaylist && (
              <>
                <div className="h-px bg-white/10 my-1" />
                <button
                  id={`menu-remove-playlist-${song.id}`}
                  className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRemoveFromPlaylist();
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove from Playlist</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
