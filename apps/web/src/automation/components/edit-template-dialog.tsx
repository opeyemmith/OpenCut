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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil } from "lucide-react";
import { useAutomationStore } from "../stores/automation-store";
import type { TemplateSummary } from "@opencut/automation";

interface EditTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateSummary | null;
}

export function EditTemplateDialog({
  isOpen,
  onOpenChange,
  template,
}: EditTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { isSaving, updateTemplateMetadata } = useAutomationStore();
  
  useEffect(() => {
    if (template && isOpen) {
      setName(template.name);
      setDescription(template.description || "");
    }
  }, [template, isOpen]);

  const handleSave = async () => {
    if (!template) return;
    
    try {
      await updateTemplateMetadata(template.id, {
        name: name.trim(),
        description: description.trim(),
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by store
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Template
          </DialogTitle>
          <DialogDescription>
            Update the template name and description.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-template-name">Name</Label>
            <Input
              id="edit-template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-template-desc">Description</Label>
            <Textarea
              id="edit-template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
