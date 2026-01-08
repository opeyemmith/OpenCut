"use client";

import { X, Edit, Trash2, Copy, Play, Calendar, User, Palette, Sparkles, Hash } from "lucide-react";
import { Character, ageOptions, genderOptions, styleOptions } from "@/lib/characters-data";
import { Button } from "@/components/ui/button";

interface CharacterDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onEdit?: (character: Character) => void;
  onDelete?: (id: string) => void;
  onClone?: (character: Character) => void;
  onUse?: (character: Character) => void;
}

export function CharacterDetailsDialog({
  isOpen,
  onClose,
  character,
  onEdit,
  onDelete,
  onClone,
  onUse,
}: CharacterDetailsDialogProps) {
  if (!isOpen || !character) return null;

  // Get labels
  const ageLabel = ageOptions.find(o => o.id === character.age)?.name || character.age;
  const genderLabel = genderOptions.find(o => o.id === character.gender)?.name || character.gender;
  const styleLabel = styleOptions.find(o => o.id === character.style)?.name || character.style;

  // Initials for fallback
  const initials = character.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Gradient fallback
  const colors = [
    "from-purple-600 to-blue-600",
    "from-pink-600 to-rose-600",
    "from-cyan-600 to-teal-600",
    "from-orange-600 to-amber-600",
    "from-green-600 to-emerald-600",
  ];
  const colorIndex = character.name.length % colors.length;
  const gradientColor = colors[colorIndex];

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row h-auto max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-[var(--bg-elevated)] shrink-0">
          {character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
              <span className="text-8xl font-bold text-white/50">{initials}</span>
            </div>
          )}
          
          {/* Style Badge overlay on image */}
          <div className="absolute bottom-4 left-4">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
              <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{styleLabel}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {character.name}
            </h2>
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                <User className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="capitalize">{genderLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                <Sparkles className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="capitalize">{ageLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                 <Calendar className="w-4 h-4" />
                 <span>Added {new Date(character.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                {character.description || "No description provided."}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
               <Hash className="w-4 h-4" />
               <span>Used {character.usageCount.toLocaleString()} times</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-2 border-t border-[var(--border-default)] flex flex-wrap gap-3">
            {onClone ? (
              <Button 
                onClick={() => handleAction(() => onClone(character))}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white h-11"
              >
                <Copy className="w-4 h-4 mr-2" /> Clone to Library
              </Button>
            ) : onUse ? (
              <Button 
                onClick={() => handleAction(() => onUse(character))}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white h-11"
              >
                <Play className="w-4 h-4 mr-2" /> Use Character
              </Button>
            ) : null}

            {(onEdit || onDelete) && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction(() => onEdit(character))}
                    className="h-11 px-4 border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
                    title="Edit (E)"
                  >
                    <Edit className="w-4 h-4 text-[var(--text-primary)]" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction(() => onDelete(character.id))}
                    className="h-11 px-4 border-[var(--border-default)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] hover:border-[var(--error)]/30 group"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--error)] transition-colors" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
