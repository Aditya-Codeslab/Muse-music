import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Song, Album, Artist, Playlist, RepeatMode } from '../types';
import { INITIAL_SONGS, INITIAL_ALBUMS, INITIAL_ARTISTS, INITIAL_PLAYLISTS } from '../data/mockData';
import { fallbackSynth } from '../utils/audioEngine';

interface PlayerContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Song[];
  queueIndex: number;
  isQueueOpen: boolean;
  isLyricsOpen: boolean;
  likedSongIds: string[];
  playlists: Playlist[];
  recentlyPlayedSongIds: string[];
  allSongs: Song[];
  albums: Album[];
  artists: Artist[];

  // Actions
  playTrack: (track: Song, queueList?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setVolume: (level: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  addToQueue: (track: Song, playNext?: boolean) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  toggleQueue: () => void;
  toggleLyrics: () => void;
  playCollection: (tracks: Song[], startIndex?: number, shuffleInitial?: boolean) => void;
  
  // Playlist Management
  createPlaylist: (title: string, description?: string) => Playlist;
  updatePlaylist: (id: string, title: string, description?: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LIKED: 'muse_music_liked_songs_v1',
  PLAYLISTS: 'muse_music_playlists_v1',
  RECENT: 'muse_music_recently_played_v1',
  VOLUME: 'muse_music_volume_v1',
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Songs, Albums, Artists master data
  const [allSongs] = useState<Song[]>(INITIAL_SONGS);
  const [albums] = useState<Album[]>(INITIAL_ALBUMS);
  const [artists] = useState<Artist[]>(INITIAL_ARTISTS);

  // Persistent User Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PLAYLISTS;
  });

  // Liked Song IDs
  const [likedSongIds, setLikedSongIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SONGS.filter(s => s.liked).map(s => s.id);
  });

  // Recently Played IDs
  const [recentlyPlayedSongIds, setRecentlyPlayedSongIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['song-1', 'song-8', 'song-5', 'song-18', 'song-15'];
  });

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 0.8;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>('all');
  const [queue, setQueue] = useState<Song[]>(INITIAL_SONGS.slice(0, 15));
  const [queueIndex, setQueueIndex] = useState<number>(0);

  // UI Drawers
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);

  // Audio elements & Fallback Synth state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUsingFallbackRef = useRef<boolean>(false);
  const fallbackTickerRef = useRef<number | null>(null);

  // Initialize HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isUsingFallbackRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = () => {
      // Switch gracefully to synthesizer fallback so audio playback never breaks
      console.warn('Audio stream error/CORS, activating musical synthesizer fallback');
      isUsingFallbackRef.current = true;
      if (isPlaying) {
        fallbackSynth.play();
        startFallbackTicker();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      fallbackSynth.pause();
      stopFallbackTicker();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedSongIds));
    } catch {
      // ignore
    }
  }, [likedSongIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch {
      // ignore
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyPlayedSongIds));
    } catch {
      // ignore
    }
  }, [recentlyPlayedSongIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, String(volume));
    } catch {
      // ignore
    }
  }, [volume]);

  // Sync volume with audio element and synth
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
    fallbackSynth.setVolume(effectiveVol);
  }, [volume, isMuted]);

  // Fallback ticker helpers
  const startFallbackTicker = useCallback(() => {
    if (fallbackTickerRef.current) clearInterval(fallbackTickerRef.current);
    fallbackTickerRef.current = window.setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1;
        if (currentTrack && next >= currentTrack.duration) {
          handleTrackEnd();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [currentTrack]);

  const stopFallbackTicker = () => {
    if (fallbackTickerRef.current) {
      clearInterval(fallbackTickerRef.current);
      fallbackTickerRef.current = null;
    }
  };

  // Add to recently played history
  const recordRecent = useCallback((songId: string) => {
    setRecentlyPlayedSongIds(prev => {
      const filtered = prev.filter(id => id !== songId);
      return [songId, ...filtered].slice(0, 30);
    });
  }, []);

  // Load and play track
  const playTrack = useCallback((track: Song, queueList?: Song[]) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration);
    recordRecent(track.id);

    if (queueList && queueList.length > 0) {
      setQueue(queueList);
      const idx = queueList.findIndex(s => s.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    }

    isUsingFallbackRef.current = false;
    stopFallbackTicker();
    fallbackSynth.pause();

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Direct audio play failed, using synth engine fallback:', err);
        isUsingFallbackRef.current = true;
        fallbackSynth.play();
        setIsPlaying(true);
        startFallbackTicker();
      });
    }
  }, [recordRecent, startFallbackTicker]);

  // Toggle play / pause
  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      if (allSongs.length > 0) {
        playTrack(allSongs[0]);
      }
      return;
    }

    if (isPlaying) {
      if (isUsingFallbackRef.current) {
        fallbackSynth.pause();
        stopFallbackTicker();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (isUsingFallbackRef.current) {
        fallbackSynth.play();
        startFallbackTicker();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          isUsingFallbackRef.current = true;
          fallbackSynth.play();
          startFallbackTicker();
          setIsPlaying(true);
        });
      }
    }
  }, [currentTrack, isPlaying, allSongs, playTrack, startFallbackTicker]);

  // Handle Next
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeat === 'one' && currentTrack) {
      seek(0);
      if (!isPlaying) togglePlay();
      return;
    }

    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        // Stop playback at end of queue
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        fallbackSynth.pause();
        stopFallbackTicker();
        return;
      }
    }

    setQueueIndex(nextIndex);
    const nextSong = queue[nextIndex];
    playTrack(nextSong);
  }, [queue, queueIndex, repeat, currentTrack, isPlaying, togglePlay, playTrack]);

  // Handle Previous
  const playPrevious = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setQueueIndex(prevIndex);
    const prevSong = queue[prevIndex];
    playTrack(prevSong);
  }, [currentTime, queue, queueIndex, playTrack]);

  // Track end handler
  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setCurrentTime(0);
    } else {
      playNext();
    }
  }, [repeat, playNext]);

  // Seek
  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (!isUsingFallbackRef.current && audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  // Set Volume
  const setVolume = (level: number) => {
    const clamped = Math.max(0, Math.min(1, level));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Toggle Shuffle
  const toggleShuffle = () => {
    setShuffle(prev => {
      const nextState = !prev;
      if (nextState) {
        // Re-order remaining queue randomly
        const current = queue[queueIndex];
        const rest = queue.filter((_, idx) => idx !== queueIndex);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        const newQueue = current ? [current, ...shuffled] : shuffled;
        setQueue(newQueue);
        setQueueIndex(0);
      }
      return nextState;
    });
  };

  // Toggle Repeat: 'off' -> 'all' -> 'one' -> 'off'
  const toggleRepeat = () => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Toggle Like
  const toggleLike = (songId: string) => {
    setLikedSongIds(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const isLiked = (songId: string) => {
    return likedSongIds.includes(songId);
  };

  // Queue manipulation
  const addToQueue = (track: Song, playNext: boolean = false) => {
    setQueue(prev => {
      if (playNext) {
        const insertIdx = queueIndex + 1;
        const copy = [...prev];
        copy.splice(insertIdx, 0, track);
        return copy;
      }
      return [...prev, track];
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      const copy = prev.filter((_, i) => i !== index);
      if (index < queueIndex) {
        setQueueIndex(queueIndex - 1);
      }
      return copy;
    });
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const toggleQueue = () => {
    setIsQueueOpen(prev => !prev);
  };

  const toggleLyrics = () => {
    setIsLyricsOpen(prev => !prev);
  };

  // Play an entire collection (album / playlist / artist top tracks)
  const playCollection = (tracks: Song[], startIndex: number = 0, shuffleInitial: boolean = false) => {
    if (tracks.length === 0) return;
    let list = [...tracks];
    let startSong = list[startIndex] || list[0];

    if (shuffleInitial) {
      list = [...tracks].sort(() => Math.random() - 0.5);
      startSong = list[0];
      setShuffle(true);
    }

    setQueue(list);
    const idx = list.findIndex(s => s.id === startSong.id);
    setQueueIndex(idx !== -1 ? idx : 0);
    playTrack(startSong, list);
  };

  // Playlist Management
  const createPlaylist = (title: string, description: string = ''): Playlist => {
    const newPl: Playlist = {
      id: `playlist-${Date.now()}`,
      title: title.trim() || 'My Playlist',
      description: description.trim() || 'A personal collection',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      songIds: [],
      isUserCreated: true,
      createdAt: new Date().toLocaleDateString(),
    };
    setPlaylists(prev => [newPl, ...prev]);
    return newPl;
  };

  const updatePlaylist = (id: string, title: string, description?: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            title: title.trim() || p.title,
            description: description !== undefined ? description : p.description,
          };
        }
        return p;
      })
    );
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId && !p.songIds.includes(songId)) {
          return { ...p, songIds: [...p.songIds, songId] };
        }
        return p;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, songIds: p.songIds.filter(id => id !== songId) };
        }
        return p;
      })
    );
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(volume - 0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        if (currentTrack) {
          toggleLike(currentTrack.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTime, duration, volume, isMuted, currentTrack]);

  return (
    <PlayerContext.Provider
      value={{
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
        likedSongIds,
        playlists,
        recentlyPlayedSongIds,
        allSongs,
        albums,
        artists,
        playTrack,
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
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        toggleQueue,
        toggleLyrics,
        playCollection,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
