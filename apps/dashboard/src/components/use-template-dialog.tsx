"use client";

import { useState } from "react";
import { Film, FileText, FolderOpen, X, Rocket } from "lucide-react";
import type { DashboardTemplate } from "@/stores/template-store";

interface UseTemplateDialogProps {
  isOpen: boolean;
  template: DashboardTemplate | null;
  onClose: () => void;
  onSubmit: (projectName: string, inputs: PlaceholderInputs) => void;
}

interface PlaceholderInputs {
  [key: string]: string;
}

const mockPlaceholders = [
  { id: "main-clip", name: "Main Video Clip", type: "media" as const },
  { id: "headline", name: "Headline Text", type: "text" as const },
  { id: "cta-text", name: "Call to Action", type: "text" as const },
];

export function UseTemplateDialog({
  isOpen,
  template,
  onClose,
  onSubmit,
}: UseTemplateDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [inputs, setInputs] = useState<PlaceholderInputs>({});

  const handleInputChange = (placeholderId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [placeholderId]: value }));
  };

  const handleSubmit = () => {
    if (!projectName.trim()) return;

    onSubmit(projectName.trim(), inputs);
    
    setProjectName("");
    setInputs({});
    onClose();
  };

  if (!isOpen || !template) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-[560px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between px-6 py-5 border-b border-[#333]">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-white">Use Template</h2>
            <p className="text-sm text-purple-400">{template.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., My New Video"
              autoFocus
              className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-white">Fill in Placeholders</h3>
            <p className="text-sm text-gray-400 mb-4">
              Provide content for each placeholder in the template
            </p>

            <div className="flex flex-col gap-4">
              {mockPlaceholders.map((placeholder) => (
                <div 
                  key={placeholder.id} 
                  className="p-4 bg-[#222] border border-[#333] rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {placeholder.type === "media" ? (
                      <Film className="w-5 h-5 text-gray-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium flex-1 text-white">{placeholder.name}</span>
                    <span className="text-xs px-2 py-1 bg-purple-500/15 text-purple-400 rounded-full uppercase">
                      {placeholder.type}
                    </span>
                  </div>
                  {placeholder.type === "text" ? (
                    <input
                      type="text"
                      value={inputs[placeholder.id] || ""}
                      onChange={(e) => handleInputChange(placeholder.id, e.target.value)}
                      placeholder={`Enter ${placeholder.name.toLowerCase()}...`}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#333] rounded-md text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all">
                      <FolderOpen className="w-5 h-5" />
                      <span>Select Media File</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-3 px-6 py-4 border-t border-[#333]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-[#333] rounded-lg text-gray-300 hover:bg-[#222] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!projectName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-4 h-4" />
            Generate Project
          </button>
        </footer>
      </div>
    </div>
  );
}
