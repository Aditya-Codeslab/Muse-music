import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Radio, Flame, Disc3 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Card } from '../components/Card';
import { HorizontalRow } from '../components/HorizontalRow';
import { Song } from '../types';

interface HomePageProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const {
    albums,
    artists,
    playlists,
    allSongs,
    recentlyPlayedSongIds,
    playCollection,
  } = usePlayer();

  // Resolve recently played songs
  const recentlyPlayedSongs = recentlyPlayedSongIds
    .map((id) => allSongs.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s));

  // Featured Spotlight Album
  const spotlightAlbum = albums[0];
  const spotlightSongs = allSongs.filter((s) => spotlightAlbum.songIds.includes(s.id));

  return (
    <div id="home-page" className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 pb-32">
      {/* Hero Featured Banner */}
      <section
        id="hero-spotlight-banner"
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-purple-950/80 via-neutral-900 to-black p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group"
      >
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none filter blur-xl scale-110"
          style={{ backgroundImage: `url(${spotlightAlbum.coverUrl})` }}
        />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-[#fa2d48]">
            <Sparkles className="w-3.5 h-3.5" />
            Spotlight • Spatial Audio
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {spotlightAlbum.title}
          </h1>

          <p
            className="text-base sm:text-lg text-neutral-300 font-medium hover:underline cursor-pointer"
            onClick={() => navigate(`/artist/${spotlightAlbum.artistId}`)}
          >
            {spotlightAlbum.artist}
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {spotlightAlbum.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-play-album-btn"
              onClick={() => playCollection(spotlightSongs, 0)}
              className="px-6 py-3 rounded-full bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#fa2d48]/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Listen Now</span>
            </button>

            <button
              id="hero-view-album-btn"
              onClick={() => navigate(`/album/${spotlightAlbum.id}`)}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-colors border border-white/10"
            >
              Explore Album
            </button>
          </div>
        </div>

        <div
          className="relative z-10 w-48 sm:w-64 aspect-square rounded-2xl overflow-hidden shadow-2xl shrink-0 cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={() => navigate(`/album/${spotlightAlbum.id}`)}
        >
          <img
            src={spotlightAlbum.coverUrl}
            alt={spotlightAlbum.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Row 1: Recently Played (Dynamic from Player history) */}
      {recentlyPlayedSongs.length > 0 && (
        <HorizontalRow
          id="row-recently-played"
          title="Recently Played"
          subtitle="Pick up right where you left off"
        >
          {recentlyPlayedSongs.map((song) => (
            <Card
              key={song.id}
              id={`recent-card-${song.id}`}
              title={song.title}
              subtitle={song.artist}
              imageUrl={song.coverUrl}
              badge="Lossless"
              onClick={() => navigate(`/album/${song.albumId}`)}
              onPlayClick={() => playCollection([song, ...allSongs.filter((s) => s.id !== song.id)], 0)}
            />
          ))}
        </HorizontalRow>
      )}

      {/* Row 2: Made For You (Curated Playlists) */}
      <HorizontalRow
        id="row-made-for-you"
        title="Made For You"
        subtitle="Personalized mixes updated for your taste"
        seeAllLink={() => navigate('/library')}
      >
        {playlists.map((pl) => {
          const plSongs = allSongs.filter((s) => pl.songIds.includes(s.id));
          return (
            <Card
              key={pl.id}
              id={`playlist-card-${pl.id}`}
              title={pl.title}
              subtitle={pl.description}
              imageUrl={pl.coverUrl}
              badge="Curated"
              onClick={() => navigate(`/playlist/${pl.id}`)}
              onPlayClick={() => playCollection(plSongs, 0)}
            />
          );
        })}
      </HorizontalRow>

      {/* Row 3: Top Charts & New Releases (Albums) */}
      <HorizontalRow
        id="row-new-releases"
        title="New Releases"
        subtitle="The latest full-length records and EPs"
        seeAllLink={() => navigate('/library')}
      >
        {albums.map((album) => {
          const albumSongs = allSongs.filter((s) => album.songIds.includes(s.id));
          return (
            <Card
              key={album.id}
              id={`album-card-${album.id}`}
              title={album.title}
              subtitle={`${album.artist} • ${album.releaseYear}`}
              imageUrl={album.coverUrl}
              badge={album.genre}
              onClick={() => navigate(`/album/${album.id}`)}
              onPlayClick={() => playCollection(albumSongs, 0)}
            />
          );
        })}
      </HorizontalRow>

      {/* Row 4: Trending Artists */}
      <HorizontalRow
        id="row-artists"
        title="Featured Artists"
        subtitle="Global stars and breakout voices"
      >
        {artists.map((artist) => {
          const artistTopSongs = allSongs.filter((s) => artist.topSongIds.includes(s.id));
          return (
            <Card
              key={artist.id}
              id={`artist-card-${artist.id}`}
              title={artist.name}
              subtitle={artist.genre}
              imageUrl={artist.imageUrl}
              isCircle
              onClick={() => navigate(`/artist/${artist.id}`)}
              onPlayClick={() => playCollection(artistTopSongs, 0)}
            />
          );
        })}
      </HorizontalRow>

      {/* Recommended Stations / Moods Banner */}
      <section
        id="radio-stations-section"
        className="rounded-2xl bg-[#141822] border border-white/10 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <Radio className="w-5 h-5 text-[#fa2d48]" />
          <div>
            <h3 className="text-xl font-bold text-white">Recommended Stations</h3>
            <p className="text-xs text-neutral-400">Continuous genre radio powered by Muse</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="p-5 rounded-2xl bg-gradient-to-br from-red-900/40 via-[#181c25] to-[#12151c] border border-white/5 hover:border-[#fa2d48]/40 transition-all cursor-pointer group flex items-center justify-between"
            onClick={() => playCollection(allSongs.filter((s) => s.genre?.includes('Pop') || s.genre?.includes('Dance')), 0, true)}
          >
            <div>
              <div className="flex items-center gap-1 text-[#fa2d48] text-xs font-bold mb-1">
                <Flame className="w-3.5 h-3.5" /> Station
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-[#fa2d48] transition-colors">
                Pop & Dance Hits Station
              </h4>
              <p className="text-xs text-neutral-400 mt-1">Non-stop energy & current anthems</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#fa2d48] text-white flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-[#181c25] to-[#12151c] border border-white/5 hover:border-[#00CFFF]/40 transition-all cursor-pointer group flex items-center justify-between"
            onClick={() => playCollection(allSongs.filter((s) => s.genre?.includes('Ambient') || s.genre?.includes('Classical')), 0, true)}
          >
            <div>
              <div className="flex items-center gap-1 text-[#00CFFF] text-xs font-bold mb-1">
                <Disc3 className="w-3.5 h-3.5" /> Station
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-[#00CFFF] transition-colors">
                Deep Ambient & Focus Flow
              </h4>
              <p className="text-xs text-neutral-400 mt-1">Peaceful soundscapes for focus</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#00CFFF] text-white flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/40 via-[#181c25] to-[#12151c] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group flex items-center justify-between"
            onClick={() => playCollection(allSongs.filter((s) => s.genre?.includes('Soul') || s.genre?.includes('Folk')), 0, true)}
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Station
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Neo-Soul & Sunset Grooves
              </h4>
              <p className="text-xs text-neutral-400 mt-1">Warm chords, silky vocals & pocket bass</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-amber-400 text-white flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
