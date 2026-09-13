import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, UserCheck, UserPlus, Sparkles } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackRow';
import { Card } from '../components/Card';
import { Song } from '../types';

interface ArtistPageProps {
  onOpenAddToPlaylist: (song: Song) => void;
}

export const ArtistPage: React.FC<ArtistPageProps> = ({ onOpenAddToPlaylist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artists, albums, allSongs, playCollection } = usePlayer();

  const [isFollowing, setIsFollowing] = useState(false);

  const artist = artists.find((a) => a.id === id) || artists[0];

  // Top Songs
  const topSongs = artist.topSongIds
    .map((songId) => allSongs.find((s) => s.id === songId))
    .filter((s): s is Song => Boolean(s));

  // Artist Albums
  const artistAlbums = albums.filter((alb) => alb.artistId === artist.id);

  return (
    <div id="artist-page" className="space-y-8 pb-36">
      {/* Artist Hero Banner */}
      <section className="relative h-72 sm:h-96 w-full overflow-hidden flex items-end p-6 sm:p-10 border-b border-white/10">
        {/* Background photo with gradient fade */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#fa2d48]" />
            Verified Artist
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            {artist.name}
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
            <span>{artist.monthlyListeners} monthly listeners</span>
            <span className="text-neutral-500">•</span>
            <span>{artist.genre}</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {topSongs.length > 0 && (
              <>
                <button
                  id="artist-play-all-btn"
                  onClick={() => playCollection(topSongs, 0)}
                  className="px-7 py-3 rounded-full bg-[#fa2d48] hover:bg-[#fc445c] text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-[#fa2d48]/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play</span>
                </button>

                <button
                  id="artist-shuffle-btn"
                  onClick={() => playCollection(topSongs, 0, true)}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2.5 backdrop-blur-md transition-colors border border-white/10"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>
              </>
            )}

            <button
              id="artist-follow-btn"
              onClick={() => setIsFollowing((prev) => !prev)}
              className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
                isFollowing
                  ? 'bg-white text-black border-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-black" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
        {/* Top Songs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Popular Tracks
          </h2>

          <div className="bg-[#141822]/60 border border-white/5 rounded-2xl p-2 divide-y divide-white/5">
            {topSongs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                showAlbum
                showCover
                contextQueue={topSongs}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
              />
            ))}
          </div>
        </section>

        {/* Discography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Discography
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {artistAlbums.map((alb) => {
              const albSongs = allSongs.filter((s) => alb.songIds.includes(s.id));
              return (
                <Card
                  key={alb.id}
                  id={`artist-album-${alb.id}`}
                  title={alb.title}
                  subtitle={`${alb.releaseYear} • ${alb.genre}`}
                  imageUrl={alb.coverUrl}
                  onClick={() => navigate(`/album/${alb.id}`)}
                  onPlayClick={() => playCollection(albSongs, 0)}
                />
              );
            })}
          </div>
        </section>

        {/* About / Bio */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#141822] border border-white/10 max-w-4xl space-y-4">
          <h3 className="text-xl font-bold text-white">About {artist.name}</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {artist.bio}
          </p>
          <div className="pt-2 flex items-center gap-6 text-xs text-neutral-400">
            <div>
              <span className="font-bold text-white block text-sm">{artist.monthlyListeners}</span>
              Monthly Listeners
            </div>
            <div>
              <span className="font-bold text-white block text-sm">{artistAlbums.length}</span>
              Releases
            </div>
            <div>
              <span className="font-bold text-white block text-sm">{artist.genre}</span>
              Primary Genre
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
