import Link from "next/link";
import { 
  Film, 
  FolderOpen, 
  CheckCircle, 
  Clock,
  Plus,
  Rocket,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-[1200px] animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Welcome to ClipFactory</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="flex items-center gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group">
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--accent-subtle)] rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Film className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--text-primary)]">3</span>
            <span className="text-sm text-[var(--text-muted)]">Templates</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group">
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--accent-subtle)] rounded-lg group-hover:scale-110 transition-transform duration-300">
            <FolderOpen className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--text-primary)]">12</span>
            <span className="text-sm text-[var(--text-muted)]">Projects</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--success)] transition-all duration-300 hover:-translate-y-1 card-glow group">
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--success-bg)] rounded-lg group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-6 h-6 text-[var(--success)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--text-primary)]">45</span>
            <span className="text-sm text-[var(--text-muted)]">Videos Generated</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--warning)] transition-all duration-300 hover:-translate-y-1 card-glow group">
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--warning-bg)] rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-[var(--warning)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--text-primary)]">2.5h</span>
            <span className="text-sm text-[var(--text-muted)]">Time Saved</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/templates"
            className="p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group"
          >
            <Plus className="w-8 h-8 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold mb-1 text-[var(--text-primary)]">Create Template</h3>
            <p className="text-sm text-[var(--text-secondary)]">Import a video from OpenCut as a template</p>
          </Link>

          <Link
            href="/projects"
            className="p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group"
          >
            <Rocket className="w-8 h-8 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold mb-1 text-[var(--text-primary)]">New Project</h3>
            <p className="text-sm text-[var(--text-secondary)]">Generate videos from your templates</p>
          </Link>

          <Link
            href="/batch"
            className="p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group"
          >
            <Zap className="w-8 h-8 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold mb-1 text-[var(--text-primary)]">Batch Generate</h3>
            <p className="text-sm text-[var(--text-secondary)]">Create multiple videos at once</p>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Recent Activity</h2>
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 p-4 border-b border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-[var(--success-bg)] rounded-lg">
              <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div className="flex-1 min-w-0 flex justify-between items-center gap-4">
              <span className="text-[var(--text-primary)] truncate font-medium">Completed: January Shorts Batch</span>
              <span className="text-xs text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap">2 hours ago</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border-b border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-[var(--accent-subtle)] rounded-lg">
              <Film className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div className="flex-1 min-w-0 flex justify-between items-center gap-4">
              <span className="text-[var(--text-primary)] truncate font-medium">Created template: YouTube Shorts Template</span>
              <span className="text-xs text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap">Yesterday</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors">
            <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-[var(--bg-elevated)] rounded-lg">
              <FolderOpen className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <div className="flex-1 min-w-0 flex justify-between items-center gap-4">
              <span className="text-[var(--text-primary)] truncate font-medium">New project: Product Launch Videos</span>
              <span className="text-xs text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap">2 days ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
