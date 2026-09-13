import React from 'react';
import { Play } from 'lucide-react';

interface CardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  isCircle?: boolean;
  badge?: string;
  onClick: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  isCircle = false,
  badge,
  onClick,
  onPlayClick,
}) => {
  return (
    <div
      id={id}
      className="group relative flex flex-col cursor-pointer transition-all duration-200 shrink-0 w-40 sm:w-44 md:w-48"
      onClick={onClick}
    >
      {/* Artwork Container */}
      <div
        className={`relative w-full aspect-square overflow-hidden bg-neutral-800/80 shadow-lg transition-transform duration-200 group-hover:-translate-y-1 ${
          isCircle ? 'rounded-full' : 'rounded-xl'
        }`}
      >
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isCircle ? 'rounded-full' : ''
          }`}
          loading="lazy"
        />

        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Spatial Audio / Badge */}
        {badge && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-300 border border-white/10 uppercase tracking-wider">
            {badge}
          </div>
        )}

        {/* Hover Play Button */}
        {onPlayClick && (
          <button
            id={`card-play-${id}`}
            className="absolute bottom-3 right-3 w-11 h-11 bg-[#fa2d48] text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick(e);
            }}
            title={`Play ${title}`}
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-2.5 px-0.5">
        <h4 className="text-sm font-semibold text-neutral-100 truncate group-hover:text-white transition-colors">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-neutral-400 truncate mt-0.5 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
