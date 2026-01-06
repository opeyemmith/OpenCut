"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useAutomationStore } from "../stores/automation-store";
import type { ExtractionOptions } from "@opencut/automation";

interface SaveTemplateDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when template is saved successfully */
  onSuccess?: (templateId: string) => void;
}

/**
 * Dialog for saving the current project as an automation template.
 * Collects template name and description before extraction.
 */
export function SaveTemplateDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { extractionSource, extractTemplate } = useAutomationStore();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Generate default name from project
      const projectName = extractionSource?.project?.name || "Project";
      setName(`${projectName} Template`);
      setDescription("");
      setError(null);
    }
  }, [isOpen, extractionSource]);

  const handleSave = async () => {
    if (!extractionSource?.project || !extractionSource?.tracks) {
      setError("No project data available for extraction");
      return;
    }

    if (!name.trim()) {
      setError("Template name is required");
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const options: ExtractionOptions = {
        templateName: name.trim(),
        templateDescription: description.trim(),
        inferTrackRoles: true,
        extractCaptionStyles: true,
      };

      const template = await extractTemplate(
        extractionSource.project,
        extractionSource.tracks,
        extractionSource.mediaFiles,
        options
      );

      onOpenChange(false);
      onSuccess?.(template.id);
    } catch (err) {
      console.error("Failed to extract template:", err);
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Save as Template
          </DialogTitle>
          <DialogDescription>
            Create a reusable template from this project. You can use it to
            generate new videos with different content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Template Name */}
          <div className="grid gap-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="My Awesome Template"
              className="bg-background border-2 border-border"
              disabled={isExtracting}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="template-description">
              Description{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              className="bg-background border-2 border-border resize-none"
              rows={3}
              disabled={isExtracting}
            />
          </div>

          {/* Extraction Info */}
          {extractionSource && (
            <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Template will include:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>
                  {extractionSource.tracks.length} track
                  {extractionSource.tracks.length !== 1 ? "s" : ""}
                </li>
                <li>
                  {extractionSource.mediaFiles.length} media placeholder
                  {extractionSource.mediaFiles.length !== 1 ? "s" : ""}
                </li>
                <li>Canvas settings and styles</li>
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExtracting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isExtracting}
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Template"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
