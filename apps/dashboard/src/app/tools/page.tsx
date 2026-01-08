"use client";

import { useState } from "react";
import { tools } from "@/lib/tools-data";
import { ToolCard } from "@/components/tools/tool-card";
import { CategoryFilter } from "@/components/tools/category-filter";
import { Sparkles } from "lucide-react";

export default function ToolsPage() {
  const [category, setCategory] = useState("all");

  const filteredTools = tools.filter((tool) => {
    if (category === "all") return true;
    return tool.category === category;
  });

  return (
    <div className="p-8 max-w-[1400px] animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[var(--accent-subtle)]">
                <Sparkles className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Creative Tools
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Explore our collection of AI-powered creative tools to supercharge your content creation workflow.
            </p>
          </div>
          <CategoryFilter value={category} onValueChange={setCategory} />
        </div>
      </header>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">No tools found in this category.</p>
        </div>
      )}
    </div>
  );
}
