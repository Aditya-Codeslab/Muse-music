import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Mic2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface LyricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LyricsDrawer: React.FC<LyricsDrawerProps> = ({ isOpen, onClose }) => {
  const { currentTrack, currentTime, seek } = usePlayer();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentTrack?.lyrics;

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (activeLineRef.current && isOpen) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, isOpen]);

  // Find active line index
  let activeIndex = -1;
  if (lyrics && lyrics.length > 0) {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        activeIndex = i;
        break;
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && currentTrack && (
        <motion.div
          id="lyrics-overlay"
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-2xl text-white flex flex-col overflow-hidden"
        >
          {/* Dynamic ambient color glow from cover */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none scale-150 blur-3xl"
            style={{
              backgroundImage: `url(${currentTrack.coverUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />

          {/* Header */}
          <header className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-xl object-cover shadow-2xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Mic2 className="w-4 h-4 text-[#fa2d48]" />
                  <span className="text-xs uppercase font-bold tracking-widest text-[#fa2d48]">
                    Time-Synced Lyrics
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white truncate max-w-md">
                  {currentTrack.title}
                </h2>
                <p className="text-xs text-neutral-400 truncate">
                  {currentTrack.artist} • {currentTrack.album}
                </p>
              </div>
            </div>

            <button
              id="close-lyrics-btn"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Lyrics Body */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-start max-w-3xl mx-auto w-full space-y-7 pb-36 text-center">
            {lyrics && lyrics.length > 0 ? (
              lyrics.map((line, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;

                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 select-none py-1.5 px-4 rounded-xl ${
                      isActive
                        ? 'text-white text-2xl sm:text-4xl font-extrabold scale-105 drop-shadow-[0_4px_24px_rgba(250,45,72,0.35)]'
                        : isPast
                        ? 'text-neutral-500 text-lg sm:text-2xl font-semibold hover:text-neutral-300'
                        : 'text-neutral-600 text-lg sm:text-2xl font-semibold hover:text-neutral-400'
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center">
                <Mic2 className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-300">Instrumental or Unsynced Lyrics</h3>
                <p className="text-sm text-neutral-500 mt-2 max-w-md">
                  Lyrics are currently not available for this track. Enjoy the music and lossless audio stream!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
