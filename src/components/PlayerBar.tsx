import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  ListMusic,
  Quote,
  Maximize2,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatters';

export const PlayerBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    queue,
    queueIndex,
    isQueueOpen,
    isLyricsOpen,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    toggleQueue,
    toggleLyrics,
  } = usePlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  if (!currentTrack) {
    return null;
  }

  const liked = isLiked(currentTrack.id);
  const displayTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const upcomingCount = Math.max(0, queue.length - 1 - queueIndex);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(Number(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
    setSeekValue(currentTime);
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seek(seekValue);
  };

  return (
    <footer
      id="persistent-player-bar"
      className="fixed bottom-0 left-0 right-0 z-30 h-20 sm:h-22 bg-[#12151c]/90 backdrop-blur-2xl border-t border-white/10 px-3 sm:px-6 flex items-center justify-between shadow-2xl select-none"
    >
      {/* LEFT: Track Info with smooth fade-in transition */}
      <div className="flex items-center gap-3 w-1/4 min-w-[140px] sm:min-w-[200px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            <div
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-neutral-800 shadow-md shrink-0 cursor-pointer group"
              onClick={() => navigate(`/album/${currentTrack.albumId}`)}
              title={`View Album: ${currentTrack.album}`}
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 pr-1">
              <h4
                className="text-xs sm:text-sm font-bold text-white truncate hover:underline cursor-pointer"
                onClick={() => navigate(`/album/${currentTrack.albumId}`)}
              >
                {currentTrack.title}
              </h4>
              <p
                className="text-[11px] sm:text-xs text-neutral-400 truncate hover:underline hover:text-neutral-200 cursor-pointer mt-0.5"
                onClick={() => navigate(`/artist/${currentTrack.artistId}`)}
              >
                {currentTrack.artist}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          id="player-like-btn"
          className={`p-2 rounded-full transition-all shrink-0 hover:scale-110 active:scale-95 ${
            liked ? 'text-[#fa2d48]' : 'text-neutral-400 hover:text-white'
          }`}
          onClick={() => toggleLike(currentTrack.id)}
          title={liked ? 'Unlike song' : 'Like song'}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-[#fa2d48]' : ''}`} />
        </button>
      </div>

      {/* CENTER: Main Controls & Scrubber */}
      <div className="flex flex-col items-center justify-center max-w-xl w-full px-2 sm:px-6">
        {/* Playback Buttons */}
        <div className="flex items-center gap-3 sm:gap-5 mb-1.5">
          {/* Shuffle */}
          <button
            id="player-shuffle-btn"
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors ${
              shuffle ? 'text-[#fa2d48]' : 'text-neutral-400 hover:text-white'
            }`}
            title={shuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            id="player-prev-btn"
            onClick={playPrevious}
            className="p-1.5 text-neutral-300 hover:text-white transition-colors hover:scale-105 active:scale-95"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause */}
          <button
            id="player-play-btn"
            onClick={togglePlay}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black hover:bg-neutral-100 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            id="player-next-btn"
            onClick={playNext}
            className="p-1.5 text-neutral-300 hover:text-white transition-colors hover:scale-105 active:scale-95"
            title="Next track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            id="player-repeat-btn"
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full relative transition-colors ${
              repeat !== 'off' ? 'text-[#fa2d48]' : 'text-neutral-400 hover:text-white'
            }`}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrubber Bar */}
        <div className="w-full flex items-center gap-2 text-[11px] font-medium text-neutral-400 tabular-nums">
          <span className="w-9 text-right">{formatTime(displayTime)}</span>

          <div className="relative flex-1 flex items-center h-4 group">
            {/* Background Track */}
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#fa2d48] rounded-full transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Native range input for accessible, smooth seeking */}
            <input
              id="player-scrubber"
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={displayTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onTouchStart={handleSeekMouseDown}
              onTouchEnd={handleSeekMouseUp}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Seek track position"
            />
          </div>

          <span className="w-9 text-left">
            -{formatTime(Math.max(0, duration - displayTime))}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & Secondary Tools */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/4 min-w-[140px] sm:min-w-[200px]">
        {/* Lyrics Button */}
        <button
          id="player-lyrics-btn"
          onClick={toggleLyrics}
          className={`p-2 rounded-lg transition-colors relative ${
            isLyricsOpen
              ? 'text-[#fa2d48] bg-white/10'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
          title="Lyrics"
        >
          <Quote className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* Queue Button */}
        <button
          id="player-queue-btn"
          onClick={toggleQueue}
          className={`p-2 rounded-lg transition-colors relative ${
            isQueueOpen
              ? 'text-[#fa2d48] bg-white/10'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
          title="Playing Next"
        >
          <ListMusic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          {upcomingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#fa2d48] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
              {upcomingCount}
            </span>
          )}
        </button>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-1.5 pl-1">
          <button
            id="player-mute-btn"
            onClick={toggleMute}
            className="p-1.5 text-neutral-400 hover:text-white rounded transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="w-20 sm:w-24 relative flex items-center group">
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#fa2d48] rounded-full transition-colors"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <input
              id="player-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
