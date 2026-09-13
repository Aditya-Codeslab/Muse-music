import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Trash2, ArrowUp, ArrowDown, Play, Music, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatters';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    isPlaying,
    queue,
    queueIndex,
    playTrack,
    removeFromQueue,
    reorderQueue,
    clearQueue,
  } = usePlayer();

  const upcomingTracks = queue.slice(queueIndex + 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          id="queue-drawer"
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.8 }}
          className="fixed inset-y-0 right-0 z-40 w-80 sm:w-96 bg-[#13161d]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col text-white"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#fa2d48]" />
              <h2 className="text-base font-bold tracking-tight">Playing Next</h2>
            </div>

            <div className="flex items-center gap-1.5">
              {upcomingTracks.length > 0 && (
                <button
                  id="clear-queue-btn"
                  onClick={clearQueue}
                  className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Clear up next queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}

              <button
                id="close-queue-btn"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-28">
            {/* Now Playing Section */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 px-1">
                Now Playing
              </span>

              {currentTrack ? (
                <div className="bg-white/10 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0 shadow-md">
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-end gap-1 h-4">
                          <span className="w-1 bg-[#fa2d48] animate-[bounce_0.8s_infinite] h-3 rounded-full" />
                          <span className="w-1 bg-[#fa2d48] animate-[bounce_1.1s_infinite_0.2s] h-4 rounded-full" />
                          <span className="w-1 bg-[#fa2d48] animate-[bounce_0.7s_infinite_0.4s] h-2 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {currentTrack.artist}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {currentTrack.album}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.04] text-center text-xs text-neutral-500">
                  No track currently playing
                </div>
              )}
            </div>

            {/* Up Next Section */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Next Up ({upcomingTracks.length})
                </span>
              </div>

              {upcomingTracks.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
                  <Music className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
                  Queue is empty.
                  <br />
                  Play an album or choose "Play Next" on any track.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {upcomingTracks.map((track, i) => {
                    const actualIndex = queueIndex + 1 + i;
                    return (
                      <div
                        key={`${track.id}-${actualIndex}`}
                        id={`queue-item-${actualIndex}`}
                        className="group relative flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/5"
                      >
                        <button
                          onClick={() => playTrack(track)}
                          className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0 cursor-pointer group/thumb"
                        >
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </button>

                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => playTrack(track)}
                        >
                          <p className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                            {track.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                            {track.artist}
                          </p>
                        </div>

                        <div className="text-[11px] text-neutral-500 tabular-nums shrink-0">
                          {formatTime(track.duration)}
                        </div>

                        {/* Reorder & Remove Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {i > 0 && (
                            <button
                              onClick={() => reorderQueue(actualIndex, actualIndex - 1)}
                              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {i < upcomingTracks.length - 1 && (
                            <button
                              onClick={() => reorderQueue(actualIndex, actualIndex + 1)}
                              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => removeFromQueue(actualIndex)}
                            className="p-1 text-neutral-400 hover:text-red-400 rounded hover:bg-red-500/10"
                            title="Remove from queue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
