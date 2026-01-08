"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CategoryFilter({ value, onValueChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">
        Filter by:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px] bg-[var(--bg-card)] border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <SelectItem value="all">All Tools</SelectItem>
          <SelectItem value="video">Video Generation</SelectItem>
          <SelectItem value="image">Image Tools</SelectItem>
          <SelectItem value="audio">Audio & Voice</SelectItem>
          <SelectItem value="text">Scripting & Text</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
