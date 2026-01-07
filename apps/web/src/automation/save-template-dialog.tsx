"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAutomationStore } from "./stores/automation-store";

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (templateId: string) => void;
}

export function SaveTemplateDialog({ isOpen, onOpenChange, onSuccess }: SaveTemplateDialogProps) {
  const { extractionSource } = useAutomationStore();
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement actual template saving logic using extractionSource using @opencut/automation core
    console.log("Saving template:", { 
      name: templateName, 
      description, 
      source: extractionSource 
    });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    onSuccess("temp_" + Date.now());
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Create a reusable template from this project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input 
              id="template-name" 
              value={templateName} 
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Vertical Vlog"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of usages"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || !templateName}>
                {isSaving ? "Saving..." : "Create Template"}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
