"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Rocket, 
  Download, 
  Trash2,
  FolderOpen,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { launchEditor, launchNewProject } from "@clipfactory/opencut-engine";
import { handoffManager } from "@/lib/handoff-manager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    id: "4",
    name: "Real Estate Walkthrough",
    templateName: "Modern Home Tour",
    status: "failed" as const,
    createdAt: new Date("2024-01-02"),
    itemCount: 1,
  },
  {
    id: "5",
    name: "Weekly Update",
    templateName: "News Style",
    status: "completed" as const,
    createdAt: new Date("2024-01-01"),
    itemCount: 1,
  },
];

const statusStyles = {
  completed: "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20",
  in_progress: "bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20",
  pending: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
  failed: "bg-[var(--error-bg)] text-[var(--error)] border border-[var(--error)]/20",
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  pending: Clock,
  failed: AlertCircle,
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  failed: "Failed",
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProjects = mockProjects
    .filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.templateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "recent":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

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
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-[var(--text-primary)] tracking-tight">Projects</h1>
          <p className="text-[var(--text-secondary)]">Manage and monitor your video generation projects</p>
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

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-[var(--bg-elevated)] border-[var(--border-default)]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">Sort:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-[var(--bg-elevated)] border-[var(--border-default)]">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-lg">
        {filteredProjects.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[30%]">
                  Project Name
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[25%] hidden sm:table-cell">
                  Template
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[15%] hidden md:table-cell">
                  Items
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[15%]">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[15%] hidden lg:table-cell">
                  Created
                </th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[100px]">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => {
                const StatusIcon = statusIcons[project.status];
                return (
                  <tr 
                    key={project.id} 
                    className={cn(
                      "hover:bg-[var(--bg-elevated)] transition-colors group",
                      index !== filteredProjects.length - 1 && "border-b border-[var(--border-subtle)]"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--text-primary)] text-sm group-hover:text-[var(--accent)] transition-colors">{project.name}</span>
                        <span className="text-xs text-[var(--text-muted)] sm:hidden mt-1">{project.templateName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] hidden sm:table-cell">{project.templateName}</td>
                    <td className="p-4 text-sm text-[var(--text-dim)] hidden md:table-cell">{project.itemCount} videos</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusStyles[project.status]
                        )}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusLabels[project.status]}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-muted)] hidden lg:table-cell">
                      {project.createdAt.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleLaunch(project)}
                          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                          title="Open in OpenCut"
                        >
                          <Rocket className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No projects found</h3>
            <p className="text-[var(--text-secondary)]">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {mockProjects.length === 0 && !searchQuery && (
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl mt-8 border-dashed">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No projects yet</h3>
          <p className="text-[var(--text-secondary)]">Create a project by applying a template with your content</p>
          <button 
            onClick={() => launchNewProject()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-dark)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
