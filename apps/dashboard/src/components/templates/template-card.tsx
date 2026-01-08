import { DashboardTemplate } from "@/stores/template-store";
import { Film, FileText, Clock, Play, Pencil, Trash2, Plus, Users, Star, Eye } from "lucide-react";

export interface PopularTemplate extends DashboardTemplate {
  uses?: number;
  rating?: number;
  author?: string;
  gradient?: string;
  category?: string;
}

interface TemplateCardProps {
  template: PopularTemplate;
  isPopular?: boolean;
  onUse?: (template: PopularTemplate) => void;
  onPreview?: (template: PopularTemplate) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClone?: (template: PopularTemplate) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function TemplateCard({ 
  template, 
  isPopular = false,
  onUse,
  onPreview,
  onEdit, 
  onDelete, 
  onClone,
  isFavorite = false,
  onToggleFavorite
}: TemplateCardProps) {
  // Determine primary action
  const handlePrimaryAction = () => {
    if (isPopular && onPreview) {
      onPreview(template);
    } else if (onUse) {
      onUse(template);
    }
  };

  return (
    <article
      className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow flex flex-col group"
    >
      {/* Thumbnail / Header */}
      {isPopular && template.gradient ? (
        <div 
          onClick={handlePrimaryAction}
          className={`h-36 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden cursor-pointer`}
        >
          <Film className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
          {/* Category badge */}
          {template.category && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 backdrop-blur-sm text-white">
              {template.category}
            </span>
          )}
          {/* Actions top-right */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
             {/* Rating */}
             {template.rating && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-medium">{template.rating}</span>
              </div>
            )}
            
            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(template.id);
                }}
                className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? "bg-white/90 text-red-500 hover:bg-white" 
                    : "bg-black/30 text-white/70 hover:bg-black/50 hover:text-white"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-glass)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <Film className="w-12 h-12 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:scale-110 transition-all duration-300" />
          
           {/* Favorite Button for Private/Default cards */}
           {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(template.id);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? "bg-[var(--bg-card)] text-red-500 border border-red-200 shadow-sm" 
                    : "bg-[var(--bg-card)]/50 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                }`}
              >
                 <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)] truncate" title={template.name}>
          {template.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2" title={template.description}>
          {template.description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
          {isPopular && template.uses !== undefined ? (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {template.uses.toLocaleString()} uses
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {template.placeholderCount} placeholders
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {template.duration}s
          </span>
        </div>

        {isPopular && template.author && (
          <p className="text-[10px] text-[var(--text-dim)] mt-3">by {template.author}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-[var(--border-default)] bg-[var(--bg-elevated)]/30">
        {isPopular && onPreview ? (
          <button
            onClick={() => onPreview(template)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-all border-r border-[var(--border-default)] font-medium last:border-r-0"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        ) : (
          onUse && (
            <button
              onClick={() => onUse(template)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-all border-r border-[var(--border-default)] font-medium last:border-r-0"
            >
              <Play className="w-4 h-4" />
              Use
            </button>
          )
        )}
        
        {isPopular ? (
          onClone && (
            <button
              onClick={() => onClone(template)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              Clone
            </button>
          )
        ) : (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(template.id)}
                className="flex-1 flex items-center justify-center py-3 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border-default)]"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(template.id)}
                className="flex-1 flex items-center justify-center py-3 text-[var(--text-secondary)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
