"use client";

import { X, Film, Play, Star, Clock, Users, FileText, CheckCircle2 } from "lucide-react";
import { type PopularTemplate } from "./template-card";

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: PopularTemplate | null;
  onUseTemplate: (template: PopularTemplate) => void;
}

export function TemplatePreviewDialog({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}: TemplatePreviewDialogProps) {
  if (!isOpen || !template) return null;

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
          {/* Left Side: Preview Visual */}
          <div className={`w-full md:w-[55%] bg-gradient-to-br ${template.gradient || "from-gray-800 to-gray-900"} relative flex items-center justify-center min-h-[300px] md:min-h-full p-8`}>
            
            {/* Play Button Overlay (Simulating Video Player) */}
            <div className="relative group cursor-pointer w-full aspect-video bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center shadow-2xl hover:bg-black/30 transition-all">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
              
              {/* Fake Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                 <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-white rounded-full" />
                 </div>
                 <span className="text-xs text-white font-medium">0:15 / {template.duration}s</span>
              </div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col bg-[#1a1a1a]">
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="mb-6">
                 {template.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-3 border border-purple-500/20">
                    {template.category}
                  </span>
                 )}
                <h2 className="text-3xl font-bold text-white mb-2">{template.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                   <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-medium">{template.rating}</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-gray-600" />
                   <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{template.uses?.toLocaleString()} uses</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-gray-600" />
                   <span className="text-gray-500">by {template.author}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">About this template</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {template.description || "Create engaging videos with this professional template. Perfect for social media content, advertisements, or personal stories. Just simply replace the placeholders with your own content."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Requirements</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#222] border border-[#333]">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="block text-white font-medium">{template.placeholderCount}</span>
                        <span className="text-xs text-gray-500">Placeholders</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#222] border border-[#333]">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="block text-white font-medium">{template.duration}s</span>
                        <span className="text-xs text-gray-500">Duration</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Best Used For</h3>
                   <ul className="space-y-2">
                      {["Social Media Reels", "Product Teasers", "Event Highlights"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                           <CheckCircle2 className="w-4 h-4 text-green-500" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#333] bg-[#222]">
              <button
                onClick={() => onUseTemplate(template)}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
