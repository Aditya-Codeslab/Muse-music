import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Library,
  Heart,
  Plus,
  Music,
  Disc3,
  Mic2,
  ListMusic,
  Sparkles,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface SidebarProps {
  onOpenCreatePlaylist: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCreatePlaylist,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const { playlists, likedSongIds } = usePlayer();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-white/10 text-white shadow-sm'
        : 'text-neutral-400 hover:text-white hover:bg-white/5'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full select-none text-neutral-300">
      {/* Brand Header */}
      <div
        className="px-5 pt-6 pb-5 flex items-center justify-between cursor-pointer"
        onClick={() => {
          navigate('/');
          if (onCloseMobile) onCloseMobile();
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fa2d48] to-[#ff6b81] flex items-center justify-center shadow-lg shadow-[#fa2d48]/25 text-white">
            <Music className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
              Muse
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#fa2d48]">
              Music
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 uppercase tracking-wider">
          Spatial
        </span>
      </div>

      {/* Main Discover Nav */}
      <div className="px-3 space-y-1">
        <NavLink to="/" end className={navLinkClass} onClick={onCloseMobile}>
          <Compass className="w-4 h-4 text-[#fa2d48]" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className={navLinkClass} onClick={onCloseMobile}>
          <Search className="w-4 h-4" />
          <span>Search</span>
        </NavLink>
      </div>

      {/* Library Section */}
      <div className="mt-6 px-3">
        <div className="px-3 pb-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Your Library
        </div>

        <div className="space-y-1">
          <NavLink to="/library" className={navLinkClass} onClick={onCloseMobile}>
            <Library className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/liked" className={navLinkClass} onClick={onCloseMobile}>
            <Heart className="w-4 h-4 text-[#fa2d48]" />
            <div className="flex items-center justify-between flex-1">
              <span>Liked Songs</span>
              {likedSongIds.length > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-400">
                  {likedSongIds.length}
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </div>

      {/* Playlists Section */}
      <div className="mt-6 flex-1 overflow-hidden flex flex-col px-3 min-h-0">
        <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Playlists</span>
          <button
            id="sidebar-new-playlist-btn"
            onClick={onOpenCreatePlaylist}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            title="Create Playlist"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 no-scrollbar pb-24">
          {playlists.map((pl) => (
            <NavLink
              key={pl.id}
              to={`/playlist/${pl.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium truncate transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`
              }
              onClick={onCloseMobile}
            >
              <ListMusic className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span className="truncate">{pl.title}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer / High-Res Audio Badge */}
      <div className="p-4 mx-3 mb-24 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 text-white font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#fa2d48]" />
          Lossless & Dolby Atmos
        </div>
        <p className="text-[10px] text-neutral-500 leading-relaxed">
          Stream in studio master quality with interactive spatial audio.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-56 lg:w-64 bg-[#0d0f14] border-r border-white/10 shrink-0 h-screen sticky top-0 z-20"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-md animate-in fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 max-w-[80vw] h-full bg-[#0d0f14] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
