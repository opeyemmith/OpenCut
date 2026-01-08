"use client";

import { Character, ageOptions, styleOptions } from "@/lib/characters-data";
import { MoreHorizontal, Edit, Trash2, Play, Copy, Palette } from "lucide-react";
import { useState } from "react";

interface CharacterCardProps {
  character: Character;
  onEdit?: (character: Character) => void;
  onDelete?: (id: string) => void;
  onUse?: (character: Character) => void;
  onClone?: (character: Character) => void;
  onClick?: (character: Character) => void;
}

export function CharacterCard({ character, onEdit, onDelete, onUse, onClone, onClick }: CharacterCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  // Get age label
  const ageInfo = ageOptions.find((a) => a.id === character.age);

  // Get style label
  const styleInfo = styleOptions.find((s) => s.id === character.style);

  // Generate initials for avatar placeholder
  const initials = character.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent color based on name
  const colors = [
    "from-purple-600 to-blue-600",
    "from-pink-600 to-rose-600",
    "from-cyan-600 to-teal-600",
    "from-orange-600 to-amber-600",
    "from-green-600 to-emerald-600",
  ];
  const colorIndex = character.name.length % colors.length;
  const gradientColor = colors[colorIndex];

  return (
    <div 
      onClick={() => onClick?.(character)}
      className={`group relative flex flex-col bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Character Image Background */}
      <div className="relative h-64 overflow-hidden">
        {character.avatar ? (
          <>
            <img
              src={character.avatar}
              alt={character.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay - subtle for badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
            <span className="text-6xl font-bold text-white/80">{initials}</span>
          </div>
        )}

        {/* Menu Button - only show if actions available */}
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 rounded-lg bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-10 z-20 w-32 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-xl overflow-hidden">
                {onEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(character); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(character.id); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}



      </div>

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-2">
        {/* Character Info */}
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 line-clamp-1">
            {character.name}
          </h3>
        </div>

        {/* Stats & Action */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            {character.usageCount.toLocaleString()} uses
          </span>
          {onClone ? (
            <button
              onClick={(e) => { e.stopPropagation(); onClone(character); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Copy className="w-3 h-3" /> Clone
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onUse?.(character); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Play className="w-3 h-3" /> Use
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
