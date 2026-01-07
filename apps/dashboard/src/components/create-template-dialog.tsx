"use client";

import { useState } from "react";
import { Film, X, Rocket } from "lucide-react";

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: NewTemplateData) => void;
}

export interface NewTemplateData {
  name: string;
  description: string;
  projectId?: string;
}

const recentProjects = [
  { id: "oc-1", name: "My YouTube Intro", duration: 15, updatedAt: "2 hours ago" },
  { id: "oc-2", name: "Product Demo", duration: 45, updatedAt: "Yesterday" },
  { id: "oc-3", name: "Social Media Clip", duration: 30, updatedAt: "3 days ago" },
];

export function CreateTemplateDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateTemplateDialogProps) {
  const [step, setStep] = useState<"source" | "details">("source");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      projectId: selectedProjectId || undefined,
    });
    
    setStep("source");
    setName("");
    setDescription("");
    setSelectedProjectId(null);
    onClose();
  };

  const handleNext = () => {
    if (selectedProjectId) {
      setStep("details");
    }
  };

  const handleBack = () => {
    setStep("source");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-[520px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-[#333]">
          <h2 className="text-xl font-semibold text-white">Create Template</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {step === "source" && (
            <>
              <p className="text-gray-300 mb-6">
                Select an OpenCut project to use as the base for your template
              </p>

              <div className="flex flex-col gap-2">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                      selectedProjectId === project.id 
                        ? "bg-purple-500/10 border-purple-500" 
                        : "bg-[#222] border-[#333] hover:border-purple-500 hover:bg-[#282828]"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-[#333] rounded-lg">
                      <Film className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block text-white">{project.name}</span>
                      <span className="text-sm text-gray-400">{project.duration}s • {project.updatedAt}</span>
                    </div>
                    {selectedProjectId === project.id && (
                      <span className="text-purple-400 text-xl">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 my-6 text-gray-500 text-sm">
                <div className="flex-1 h-px bg-[#333]" />
                <span>or</span>
                <div className="flex-1 h-px bg-[#333]" />
              </div>

              <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#333] rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all">
                <Rocket className="w-5 h-5" />
                <span>Create New Project in OpenCut</span>
              </button>
            </>
          )}

          {step === "details" && (
            <>
              <p className="text-gray-300 mb-6">
                Configure your template settings
              </p>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-white">Template Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., YouTube Shorts Template"
                  autoFocus
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this template is for..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-y min-h-[80px]"
                />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Template Preview</h4>
                <div className="flex items-center gap-4 p-4 bg-[#222] border border-[#333] rounded-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg flex items-center justify-center">
                    <Film className="w-6 h-6 text-white/50" />
                  </div>
                  <div>
                    <span className="font-medium block text-white">{name || "Untitled Template"}</span>
                    <span className="text-sm text-gray-400">3 placeholders detected</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="flex items-center gap-3 px-6 py-4 border-t border-[#333]">
          {step === "details" && (
            <button 
              onClick={handleBack}
              className="px-4 py-2.5 border border-[#333] rounded-lg text-gray-300 hover:bg-[#222] hover:text-white transition-all"
            >
              ← Back
            </button>
          )}
          <div className="flex-1" />
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-[#333] rounded-lg text-gray-300 hover:bg-[#222] hover:text-white transition-all"
          >
            Cancel
          </button>
          {step === "source" ? (
            <button
              onClick={handleNext}
              disabled={!selectedProjectId}
              className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Template
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
