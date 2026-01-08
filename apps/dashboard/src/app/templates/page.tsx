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
  Trash2,
  Lock,
  Globe,
  Star,
  Users,
  Search
} from "lucide-react";

type TabType = "private" | "popular";

// Private templates (user's own)
const privateTemplates: DashboardTemplate[] = [
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

// Popular/Public templates
interface PopularTemplate extends DashboardTemplate {
  uses: number;
  rating: number;
  author: string;
  gradient: string;
  category: string;
}

const popularTemplates: PopularTemplate[] = [
  {
    id: "pop-1",
    name: "Viral TikTok Format",
    description: "High-engagement format with trending hooks and captions",
    thumbnail: undefined,
    placeholderCount: 4,
    duration: 30,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    uses: 12500,
    rating: 4.9,
    author: "ClipFactory Team",
    gradient: "from-pink-500 to-rose-500",
    category: "Short Form",
  },
  {
    id: "pop-2",
    name: "YouTube Explainer",
    description: "Professional explainer video with animated graphics",
    thumbnail: undefined,
    placeholderCount: 6,
    duration: 120,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    uses: 8900,
    rating: 4.8,
    author: "ClipFactory Team",
    gradient: "from-red-500 to-orange-500",
    category: "Long Form",
  },
  {
    id: "pop-3",
    name: "Instagram Carousel Intro",
    description: "Eye-catching intro for carousel posts and reels",
    thumbnail: undefined,
    placeholderCount: 3,
    duration: 15,
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2023-12-28"),
    uses: 7600,
    rating: 4.7,
    author: "SocialPro",
    gradient: "from-purple-500 to-pink-500",
    category: "Social Media",
  },
  {
    id: "pop-4",
    name: "Product Launch Reveal",
    description: "Dramatic product reveal with premium animations",
    thumbnail: undefined,
    placeholderCount: 5,
    duration: 45,
    createdAt: new Date("2023-12-25"),
    updatedAt: new Date("2023-12-25"),
    uses: 5400,
    rating: 4.8,
    author: "MarketingPro",
    gradient: "from-blue-500 to-cyan-500",
    category: "Marketing",
  },
  {
    id: "pop-5",
    name: "Podcast Clip Template",
    description: "Convert podcast highlights into viral clips",
    thumbnail: undefined,
    placeholderCount: 2,
    duration: 60,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2023-12-20"),
    uses: 4200,
    rating: 4.6,
    author: "PodcastPro",
    gradient: "from-green-500 to-emerald-500",
    category: "Podcast",
  },
  {
    id: "pop-6",
    name: "Testimonial Showcase",
    description: "Customer testimonial with animated quotes",
    thumbnail: undefined,
    placeholderCount: 4,
    duration: 30,
    createdAt: new Date("2023-12-18"),
    updatedAt: new Date("2023-12-18"),
    uses: 3800,
    rating: 4.5,
    author: "ClipFactory Team",
    gradient: "from-amber-500 to-yellow-500",
    category: "Marketing",
  },
];

export default function TemplatesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("private");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const addProject = useTemplateStore((state) => state.addProject);

  // Get unique categories from popular templates
  const categories = ["all", ...new Set(popularTemplates.map(t => t.category))];

  // Filter templates based on search and category
  const filteredPopularTemplates = popularTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredPrivateTemplates = privateTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleCloneTemplate = (template: PopularTemplate) => {
    toast.success(`Template "${template.name}" cloned to your library!`);
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

      {/* Tabs */}
      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] mb-8">
        <button
          onClick={() => setActiveTab("private")}
          className={`relative px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "private"
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
             My Templates
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === "private" 
                ? "bg-[var(--accent)]/10 text-[var(--accent)]" 
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
            }`}>
              {privateTemplates.length}
            </span>
          </div>
          {activeTab === "private" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("popular")}
          className={`relative px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "popular"
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Popular Templates
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === "popular" 
                ? "bg-[var(--accent)]/10 text-[var(--accent)]" 
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
            }`}>
              {popularTemplates.length}
            </span>
          </div>
          {activeTab === "popular" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
        </div>
        
        {activeTab === "popular" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Private Templates Grid */}
      {activeTab === "private" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrivateTemplates.map((template) => (
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
      )}

      {/* Popular Templates Grid */}
      {activeTab === "popular" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPopularTemplates.map((template) => (
            <article
              key={template.id}
              className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow flex flex-col group"
            >
              {/* Gradient Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden`}>
                <Film className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                {/* Category badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 backdrop-blur-sm text-white">
                  {template.category}
                </span>
                {/* Rating */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-medium">{template.rating}</span>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <h3 className="font-semibold mb-1 text-[var(--text-primary)] truncate">{template.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">{template.description}</p>
                
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {template.uses.toLocaleString()} uses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {template.duration}s
                  </span>
                </div>
                
                <p className="text-[10px] text-[var(--text-dim)] mt-2">by {template.author}</p>
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
                  onClick={() => handleCloneTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Clone
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty states */}
      {activeTab === "private" && filteredPrivateTemplates.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">No templates found matching "{searchQuery}"</p>
        </div>
      )}

      {activeTab === "popular" && filteredPopularTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">No templates found matching your criteria</p>
        </div>
      )}

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
