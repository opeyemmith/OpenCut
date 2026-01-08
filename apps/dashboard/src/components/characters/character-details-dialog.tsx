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
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Visual */}
          <div className="w-full md:w-[45%] relative bg-[#111] border-r border-[#333] flex flex-col">
            <div className="flex-1 relative overflow-hidden group">
              {character.avatar ? (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
                  <span className="text-9xl font-bold text-white/30 select-none">{initials}</span>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />

              {/* Preview Voice Button (Mock) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 transition-all transform hover:scale-105 shadow-xl">
                   <Play className="w-5 h-5 fill-current" />
                   Preview Voice
                </button>
              </div>

              {/* Style Badge */}
              <div className="absolute bottom-6 left-6">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10 shadow-lg">
                  <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{styleLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col bg-[#1a1a1a] min-w-0">
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                   <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider border border-[var(--accent)]/20">
                      Character
                   </span>
                   {character.author && (
                     <span className="text-xs text-gray-500">by {character.author}</span>
                   )}
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{character.name}</h2>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="capitalize">{genderLabel}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="capitalize">{ageLabel}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-700" />
                  <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" />
                     <span>Added {new Date(character.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed text-base border-l-2 border-[var(--accent)] pl-4">
                    {character.description || "No description provided."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-[#222] border border-[#333]">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Usage</div>
                      <div className="text-2xl font-bold text-white">{character.usageCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Projects created</div>
                   </div>
                   <div className="p-4 rounded-xl bg-[#222] border border-[#333]">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Voice ID</div>
                      <div className="text-lg font-mono text-white truncate opacity-70">#8293...</div>
                      <div className="text-xs text-gray-500">Global ID</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-[#333] bg-[#222] flex gap-3">
                {onClone ? (
                  <Button 
                    onClick={() => handleAction(() => onClone(character))}
                    className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white h-12 text-base font-semibold shadow-lg shadow-purple-900/20"
                  >
                    <Copy className="w-5 h-5 mr-2" /> Clone to Library
                  </Button>
                ) : onUse ? (
                  <Button 
                    onClick={() => handleAction(() => onUse(character))}
                    className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white h-12 text-base font-semibold shadow-lg shadow-purple-900/20"
                  >
                    <Play className="w-5 h-5 mr-2" /> Use Character
                  </Button>
                ) : null}

                {(onEdit || onDelete) && (
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        onClick={() => handleAction(() => onEdit(character))}
                        className="h-12 w-12 p-0 border-[#444] bg-[#333] hover:bg-[#444] hover:text-white"
                        title="Edit Character"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        onClick={() => handleAction(() => onDelete(character.id))}
                        className="h-12 w-12 p-0 border-[#444] bg-[#333] hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50"
                        title="Delete Character"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
