"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Search,
  Trash2,
  Copy,
  Download,
  Upload,
  MoreHorizontal,
  Loader2,
  FolderOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutomationStore } from "../stores/automation-store";
import type { TemplateSummary } from "@opencut/automation";

interface TemplateSelectorProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when a template is selected */
  onSelect: (templateId: string) => void;
}

/**
 * Dialog for browsing and selecting automation templates.
 */
export function TemplateSelector({
  isOpen,
  onOpenChange,
  onSelect,
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    templates,
    isLoading,
    loadTemplates,
    deleteTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
  } = useAutomationStore();

  // Load templates when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setSelectedId(null);
      setSearchQuery("");
    }
  }, [isOpen, loadTemplates]);

  // Filter templates by search query
  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedId) {
      onSelect(selectedId);
      onOpenChange(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleDuplicate = async (template: TemplateSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    await duplicateTemplate(template.id, `${template.name} (Copy)`);
  };

  const handleExport = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const json = await exportTemplate(id);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        await importTemplate(text);
      }
    };
    input.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Select Template
          </DialogTitle>
          <DialogDescription>
            Choose a template to create a new project from.
          </DialogDescription>
        </DialogHeader>

        {/* Search and Import */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 bg-background border-2 border-border"
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleImport}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        {/* Template List */}
        <ScrollArea className="flex-1 min-h-[200px] max-h-[300px] -mx-6 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery ? "No templates found" : "No templates yet"}
              </p>
              {!searchQuery && (
                <p className="text-xs mt-1">
                  Save a project as template to get started
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedId === template.id}
                  onClick={() => setSelectedId(template.id)}
                  onDelete={(e) => handleDelete(template.id, e)}
                  onDuplicate={(e) => handleDuplicate(template, e)}
                  onExport={(e) => handleExport(template.id, template.name, e)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedId}>
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Individual template card in the list.
 */
function TemplateCard({
  template,
  isSelected,
  onClick,
  onDelete,
  onDuplicate,
  onExport,
}: {
  template: TemplateSummary;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onExport: (e: React.MouseEvent) => void;
}) {
  const timeAgo = formatTimeAgo(template.updatedAt);

  return (
    <div
      className={`
        group relative p-3 rounded-lg border-2 cursor-pointer transition-colors
        ${isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{template.name}</h4>
          {template.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {template.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{template.placeholderCount} placeholders</span>
            <span>{template.trackCount} tracks</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/**
 * Format a date string to relative time.
 */
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
      return date.toLocaleDateString();
    }
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    if (diffMins > 0) {
      return `${diffMins}m ago`;
    }
    return "just now";
  } catch {
    return "";
  }
}
