import Link from "next/link";
import { 
  Film, 
  FolderOpen, 
  CheckCircle, 
  Clock,
  Plus,
  Rocket,
  Zap,
  Video,
  FileVideo,
  Image,
  Wand2,
  ArrowRight,
  Star
} from "lucide-react";

// Featured tools data (subset from tools-data)
const featuredTools = [
  {
    id: "short-video",
    title: "Short Videos",
    description: "Generate viral short-form videos from text or long videos.",
    icon: Video,
    href: "/tools",
    color: "var(--accent)",
  },
  {
    id: "long-video",
    title: "Long-form Videos",
    description: "Create documentary-style long videos with AI.",
    icon: FileVideo,
    href: "/tools",
    color: "var(--accent)",
  },
  {
    id: "image-gen",
    title: "Image Generation",
    description: "Create stunning visuals from text prompts.",
    icon: Image,
    href: "/tools",
    color: "var(--accent)",
  },
  {
    id: "img2img",
    title: "Image to Image",
    description: "Transform images into new styles.",
    icon: Wand2,
    href: "/tools",
    badge: "New",
  },
];

// Popular templates data with enhanced visuals
const popularTemplates = [
  {
    id: "1",
    name: "YouTube Shorts Template",
    uses: 1250,
    category: "Short Form",
    duration: "0:30 - 1:00",
    gradient: "from-red-500 to-orange-500",
    rating: 4.9,
  },
  {
    id: "2",
    name: "TikTok Viral Format",
    uses: 980,
    category: "Short Form",
    duration: "0:15 - 0:60",
    gradient: "from-pink-500 to-purple-500",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Product Showcase",
    uses: 756,
    category: "Marketing",
    duration: "0:30 - 2:00",
    gradient: "from-blue-500 to-cyan-500",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Instagram Reels",
    uses: 654,
    category: "Social Media",
    duration: "0:15 - 0:90",
    gradient: "from-purple-500 to-pink-500",
    rating: 4.6,
  },
];

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

      {/* Featured Tools Showcase */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Featured Tools</h2>
          <Link 
            href="/tools" 
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors flex items-center gap-1 group"
          >
            View all tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="relative p-5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow group"
              >
                {tool.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                    {tool.badge}
                  </span>
                )}
                <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent-subtle)] rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{tool.title}</h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Popular Templates</h2>
          <Link 
            href="/templates" 
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors flex items-center gap-1 group"
          >
            Browse all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTemplates.map((template) => (
            <Link
              key={template.id}
              href="/templates"
              className="group bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow"
            >
              {/* Thumbnail with gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                <Film className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                {/* Category badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 backdrop-blur-sm text-white">
                  {template.category}
                </span>
                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded bg-black/40 backdrop-blur-sm text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.duration}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 truncate">{template.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[var(--warning)] fill-[var(--warning)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{template.rating}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{template.uses.toLocaleString()} uses</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
