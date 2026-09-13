import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Menu,
  Keyboard,
  Cast,
  User,
  Check,
  Headphones,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { likedSongIds, playlists, allSongs } = usePlayer();

  const [query, setQuery] = useState('');
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sync search input if URL has search param
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
    } else {
      setQuery('');
    }
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (location.pathname === '/search') {
      navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
    } else if (val.trim()) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <>
      <header
        id="top-bar"
        className="sticky top-0 z-20 h-16 bg-[#0b0d10]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 flex items-center justify-between"
      >
        {/* LEFT: Mobile Menu + History Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            <button
              id="nav-back-btn"
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Go Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="nav-forward-btn"
              onClick={() => navigate(1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Go Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-md mx-3 sm:mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="topbar-search-input"
              type="text"
              placeholder="Artists, Songs, Lyrics, and More..."
              value={query}
              onChange={handleSearchChange}
              onFocus={() => {
                if (location.pathname !== '/search') {
                  navigate('/search');
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.14] border border-white/10 rounded-full focus:outline-none focus:border-[#fa2d48] text-white placeholder:text-neutral-400 transition-all shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  if (location.pathname === '/search') {
                    navigate('/search', { replace: true });
                  }
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* RIGHT: Status, Shortcuts & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Spatial Audio / Airplay indicator */}
          <button
            id="airplay-btn"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-neutral-300 transition-colors"
            title="Spatial Audio Enabled"
          >
            <Headphones className="w-3.5 h-3.5 text-[#fa2d48]" />
            <span className="text-[11px] font-semibold text-neutral-200">Hi-Res Lossless</span>
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            id="shortcuts-btn"
            onClick={() => setShowKeyboardModal(true)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fa2d48] to-[#9b51e0] p-0.5 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Account & Stats"
            >
              <div className="w-full h-full rounded-full bg-[#12151c] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Profile Menu Popover */}
            {showProfileMenu && (
              <div
                className="absolute right-0 top-10 z-50 w-64 bg-[#181c25] border border-white/10 rounded-2xl shadow-2xl p-4 text-white animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#fa2d48] flex items-center justify-center font-bold text-white shadow-md">
                    M
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold truncate">Muse Listener</h4>
                    <p className="text-xs text-[#fa2d48] font-medium">Apple Music Subscriber</p>
                  </div>
                </div>

                <div className="py-3 space-y-2 text-xs text-neutral-300">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-neutral-400">Library Songs</span>
                    <span className="font-bold text-white">{allSongs.length}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-neutral-400">Liked Songs</span>
                    <span className="font-bold text-white">{likedSongIds.length}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-neutral-400">Playlists</span>
                    <span className="font-bold text-white">{playlists.length}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-neutral-400">Audio Quality</span>
                    <span className="text-[#fa2d48] font-bold">24-bit / 192kHz</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full py-1.5 text-xs text-center font-semibold text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowKeyboardModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#161a22] border border-white/10 rounded-2xl shadow-2xl p-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#fa2d48]" />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Play / Pause</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">Space</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Seek Forward 5s</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">Arrow Right</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Seek Backward 5s</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">Arrow Left</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Volume Up / Down</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">Arrow Up / Down</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Mute / Unmute</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">M</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Like / Unlike Track</span>
                <kbd className="px-2 py-1 rounded bg-white/10 text-neutral-200 font-mono font-bold">L</kbd>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-right">
              <button
                onClick={() => setShowKeyboardModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
