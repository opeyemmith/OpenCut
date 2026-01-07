"use client";

import Link from "next/link";
import { 
  Plus, 
  Rocket, 
  Download, 
  Trash2,
  FolderOpen 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { launchEditor, launchNewProject } from "@clipfactory/opencut-engine";
import { handoffManager } from "@/lib/handoff-manager";

// Mock normalized project for MVP testing - simulating DB retrieval
const getMockProjectPayload = (id: string, name: string) => ({
  id,
  version: "1.0.0", 
  metadata: { name, created: Date.now(), modified: Date.now() },
  canvas: { width: 1920, height: 1080, fps: 30 },
  tracks: [], // Empty for now
  mediaManifest: { files: [] }
});

const mockProjects = [
  {
    id: "1",
    name: "January Shorts Batch",
    templateName: "YouTube Shorts Template",
    status: "completed" as const,
    createdAt: new Date("2024-01-06"),
    itemCount: 5,
  },
  {
    id: "2",
    name: "Product Launch Videos",
    templateName: "Product Showcase",
    status: "in_progress" as const,
    createdAt: new Date("2024-01-05"),
    itemCount: 3,
  },
  {
    id: "3",
    name: "TikTok Series",
    templateName: "TikTok Hook Template",
    status: "pending" as const,
    createdAt: new Date("2024-01-04"),
    itemCount: 10,
  },
];

const statusStyles = {
  completed: "bg-[var(--success-bg)] text-[var(--success)] ring-1 ring-[var(--success)]/20",
  in_progress: "bg-[var(--warning-bg)] text-[var(--warning)] ring-1 ring-[var(--warning)]/20 animate-pulse-subtle",
  pending: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] ring-1 ring-[var(--border-default)]",
  failed: "bg-[var(--error-bg)] text-[var(--error)] ring-1 ring-[var(--error)]/20",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  failed: "Failed",
};

export default function ProjectsPage() {
  const handleLaunch = (project: { id: string, name: string }) => {
    // 1. Open the window first (sync response to user click)
    const win = launchEditor(project.id);
    
    if (win) {
      // 2. Retrieve data (mock for now, w/ async DB call in real app)
      const payload = getMockProjectPayload(project.id, project.name);
      
      // 3. Initiate the handoff protocol
      // @ts-ignore - Partial types for mock
      handoffManager.initiateHandoff(win, payload);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] animate-in fade-in duration-500">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-[var(--text-primary)] tracking-tight">Projects</h1>
          <p className="text-[var(--text-secondary)]">Generated videos from your templates</p>
        </div>
        <button 
          onClick={() => launchNewProject()}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </header>

      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Project Name
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Template
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Items
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Status
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Created
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProjects.map((project, index) => (
              <tr 
                key={project.id} 
                className={cn(
                  "hover:bg-[var(--bg-elevated)] transition-colors group",
                  index !== mockProjects.length - 1 && "border-b border-[var(--border-subtle)]"
                )}
              >
                <td className="p-4">
                  <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{project.name}</span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{project.templateName}</td>
                <td className="p-4 text-[var(--text-dim)]">{project.itemCount} videos</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      statusStyles[project.status]
                    )}
                  >
                    {statusLabels[project.status]}
                  </span>
                </td>
                <td className="p-4 text-sm text-[var(--text-muted)]">
                  {project.createdAt.toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleLaunch(project)}
                      className="p-2 border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--accent)] transition-all"
                      title="Open in OpenCut"
                    >
                      <Rocket className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-white hover:bg-[var(--bg-elevated)] transition-all"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:border-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mockProjects.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl mt-8 border-dashed">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No projects yet</h3>
          <p className="text-[var(--text-secondary)]">Create a project by applying a template with your content</p>
        </div>
      )}
    </div>
  );
}
