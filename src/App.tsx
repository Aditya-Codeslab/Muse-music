/**
 * Muse Music - Apple Music Clone
 * 
 * Tech Stack: React 18+, React Router, HTML5 Audio with Fallback Web Audio Synthesizer,
 * Context API for global playback state, LocalStorage for persistent libraries & likes.
 */

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PlayerBar } from './components/PlayerBar';
import { QueueDrawer } from './components/QueueDrawer';
import { LyricsDrawer } from './components/LyricsDrawer';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { AlbumDetail } from './pages/AlbumDetail';
import { PlaylistDetail } from './pages/PlaylistDetail';
import { ArtistPage } from './pages/ArtistPage';
import { Song } from './types';

/**
 * Main Layout Shell
 * Organizes responsive Sidebar, sticky TopBar, scrollable route views, and bottom PlayerBar.
 */
const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isQueueOpen, toggleQueue, isLyricsOpen, toggleLyrics } = usePlayer();

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global playlist modals
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const handleOpenAddToPlaylist = (song: Song) => {
    setSelectedSongForPlaylist(song);
  };

  const handleCreatedPlaylist = (id: string) => {
    navigate(`/playlist/${id}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0d10] text-[#f5f5f7]">
      {/* 1. Left Persistent / Collapsible Navigation Sidebar */}
      <Sidebar
        onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Sticky Top Bar (Search, Navigation, Profile, Shortcuts) */}
        <TopBar onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

        {/* Scrollable View Area */}
        <main
          id="main-scrollable-container"
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <Routes>
            <Route path="/" element={<HomePage onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            <Route path="/search" element={<SearchPage onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            <Route
              path="/library"
              element={
                <LibraryPage
                  onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
                  onOpenAddToPlaylist={handleOpenAddToPlaylist}
                />
              }
            />
            <Route path="/liked" element={<LikedSongsPage onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            <Route path="/album/:id" element={<AlbumDetail onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            <Route path="/playlist/:id" element={<PlaylistDetail onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            <Route path="/artist/:id" element={<ArtistPage onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
            {/* Fallback route */}
            <Route path="*" element={<HomePage onOpenAddToPlaylist={handleOpenAddToPlaylist} />} />
          </Routes>
        </main>
      </div>

      {/* 3. Slide-out Queue Drawer */}
      <QueueDrawer isOpen={isQueueOpen} onClose={toggleQueue} />

      {/* 4. Fullscreen / Overlay Time-Synced Lyrics Drawer */}
      <LyricsDrawer isOpen={isLyricsOpen} onClose={toggleLyrics} />

      {/* 5. Bottom Persistent Player Bar */}
      <PlayerBar />

      {/* 6. Context Modals */}
      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={Boolean(selectedSongForPlaylist)}
        onClose={() => setSelectedSongForPlaylist(null)}
        onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
      />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreated={handleCreatedPlaylist}
      />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <PlayerProvider>
        <AppLayout />
      </PlayerProvider>
    </Router>
  );
}
