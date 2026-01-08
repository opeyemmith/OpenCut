import Link from "next/link";
import { Tool } from "@/lib/tools-data";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available" || tool.status === "beta";

  return (
    <div className="group relative flex flex-col h-full p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 card-glow">
      {/* Badge */}
      {tool.badge && (
        <span className="absolute top-4 right-4 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
          {tool.badge}
        </span>
      )}
      {tool.status === "coming_soon" && (
        <span className="absolute top-4 right-4 px-2.5 py-0.5 text-xs font-medium rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]">
          Coming Soon
        </span>
      )}

      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-[var(--accent-subtle)] rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-[var(--accent)]" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {tool.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-6 flex-grow">
        {tool.description}
      </p>

      {/* Action Button */}
      {isAvailable ? (
        <Link
          href={tool.href}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-all duration-200 group/btn"
        >
          Try it Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
        >
          Not Available Yet
        </button>
      )}
    </div>
  );
}
