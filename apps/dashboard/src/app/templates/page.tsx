"use client";

import { useState } from "react";
import { CreateTemplateDialog, UseTemplateDialog, type NewTemplateData } from "@/components";
import { useTemplateStore, type DashboardTemplate } from "@/stores/template-store";
import { launchEditor } from "@clipfactory/opencut-engine";
import { toast } from "sonner";
import { 
  Plus, 
  Film, 
  FileText, 
  Clock, 
  Play, 
  Pencil, 
  Trash2 
} from "lucide-react";

const mockTemplates: DashboardTemplate[] = [
  {
    id: "1",
    name: "YouTube Shorts Template",
    description: "Vertical video template with dynamic captions",
    thumbnail: undefined,
    placeholderCount: 3,
    duration: 60,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "2",
    name: "TikTok Hook Template",
    description: "Attention-grabbing intro with text overlays",
    thumbnail: undefined,
    placeholderCount: 5,
    duration: 15,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "3",
    name: "Product Showcase",
    description: "Professional product reveal animation",
    thumbnail: undefined,
    placeholderCount: 4,
    duration: 30,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export default function TemplatesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const addProject = useTemplateStore((state) => state.addProject);

  const handleCreateTemplate = (data: NewTemplateData) => {
    const newTemplate: DashboardTemplate = {
      id: `template-${Date.now()}`,
      name: data.name,
      description: data.description,
      placeholderCount: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTemplate(newTemplate);
    toast.success(`Template "${data.name}" created successfully!`);
  };

  const handleUseTemplate = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
  };

  const handleGenerateProject = (projectName: string, inputs: Record<string, string>) => {
    if (!selectedTemplate) return;

    const projectId = `project-${Date.now()}`;
    addProject({
      id: projectId,
      name: projectName,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      status: "pending",
      itemCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success(`Project "${projectName}" created! Opening in OpenCut...`);
    launchEditor(projectId);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (templateId: string) => {
    toast.info("Template editing coming soon!");
  };

  const handleDeleteTemplate = (templateId: string) => {
    toast.success("Template deleted");
  };

  return (
    <div className="p-8 max-w-[1400px] animate-in fade-in duration-500">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-[var(--text-primary)] tracking-tight">Templates</h1>
          <p className="text-[var(--text-secondary)]">Manage your automation templates</p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Plus className="w-5 h-5" />
          <span>New Template</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTemplates.map((template) => (
          <article
            key={template.id}
            className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow flex flex-col group"
          >
            <div className="h-40 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-glass)] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
              <Film className="w-12 h-12 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:scale-110 transition-all duration-300" />
            </div>
            <div className="flex-1 p-5">
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{template.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{template.description}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {template.placeholderCount} placeholders
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {template.duration}s
                </span>
              </div>
            </div>
            <div className="flex border-t border-[var(--border-default)] bg-[var(--bg-elevated)]/30">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-all border-r border-[var(--border-default)] font-medium"
              >
                <Play className="w-4 h-4" />
                Use
              </button>
              <button
                onClick={() => handleEditTemplate(template.id)}
                className="flex-1 flex items-center justify-center py-3 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border-default)]"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="flex-1 flex items-center justify-center py-3 text-[var(--text-secondary)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}

        <article
          onClick={() => setIsCreateDialogOpen(true)}
          className="min-h-[280px] border-2 border-dashed border-[var(--border-default)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]/10 transition-all duration-300 group"
        >
          <div className="text-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[var(--accent)]/10">
              <Plus className="w-8 h-8 group-hover:text-[var(--accent)] transition-colors" />
            </div>
            <span className="font-medium">Create Template</span>
            <p className="text-xs mt-2 max-w-[180px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
              Create a video in OpenCut, then import it as a template
            </p>
          </div>
        </article>
      </div>

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTemplate}
      />

      <UseTemplateDialog
        isOpen={selectedTemplate !== null}
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onSubmit={handleGenerateProject}
      />
    </div>
  );
}
