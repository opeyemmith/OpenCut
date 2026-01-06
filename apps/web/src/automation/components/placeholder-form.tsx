"use client";

import { useState, useCallback, useRef } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Film,
  Music,
  Image as ImageIcon,
  Type,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useAutomationStore } from "../stores/automation-store";
import type {
  AutomationTemplate,
  PlaceholderDefinition,
  PlaceholderInput,
  AutomationInputs,
} from "@opencut/automation";

interface PlaceholderFormProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** The template being applied */
  template: AutomationTemplate | null;
  /** Callback when form is submitted with inputs */
  onSubmit: (inputs: AutomationInputs) => void;
}

/**
 * Dialog form for filling in placeholder values when applying a template.
 */
export function PlaceholderForm({
  isOpen,
  onOpenChange,
  template,
  onSubmit,
}: PlaceholderFormProps) {
  const [inputs, setInputs] = useState<Map<string, PlaceholderInput>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (placeholderId: string, input: PlaceholderInput | null) => {
      setInputs((prev) => {
        const next = new Map(prev);
        if (input) {
          next.set(placeholderId, input);
        } else {
          next.delete(placeholderId);
        }
        return next;
      });

      // Clear error when input changes
      setErrors((prev) => {
        const next = new Map(prev);
        next.delete(placeholderId);
        return next;
      });
    },
    []
  );

  const validateInputs = (): boolean => {
    if (!template) return false;

    const newErrors = new Map<string, string>();

    for (const placeholder of template.placeholders) {
      if (placeholder.required && !inputs.has(placeholder.id)) {
        newErrors.set(placeholder.id, `${placeholder.name} is required`);
      }
    }

    setErrors(newErrors);
    return newErrors.size === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const automationInputs: AutomationInputs = {
        placeholders: inputs,
        options: {
          generateCaptions: false, // Phase 2
          applyRules: false, // Phase 2
        },
      };

      onSubmit(automationInputs);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!template) return null;

  // Sort placeholders by order
  const sortedPlaceholders = [...template.placeholders].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const requiredCount = sortedPlaceholders.filter((p) => p.required).length;
  const filledCount = sortedPlaceholders.filter(
    (p) => p.required && inputs.has(p.id)
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Apply Template
          </DialogTitle>
          <DialogDescription>
            Fill in the placeholders to generate a new project from{" "}
            <span className="font-medium text-foreground">{template.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        {requiredCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {filledCount} of {requiredCount} required fields filled
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(filledCount / requiredCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Placeholder Fields */}
        <ScrollArea className="flex-1 min-h-[200px] max-h-[400px] -mx-6 px-6">
          <div className="space-y-4 py-2">
            {sortedPlaceholders.map((placeholder) => (
              <PlaceholderField
                key={placeholder.id}
                placeholder={placeholder}
                value={inputs.get(placeholder.id)}
                error={errors.get(placeholder.id)}
                onChange={(input) => handleInputChange(placeholder.id, input)}
              />
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || filledCount < requiredCount}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Individual placeholder input field.
 */
function PlaceholderField({
  placeholder,
  value,
  error,
  onChange,
}: {
  placeholder: PlaceholderDefinition;
  value: PlaceholderInput | undefined;
  error: string | undefined;
  onChange: (input: PlaceholderInput | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ type: "file", file });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text) {
      onChange({ type: "text", value: text });
    } else {
      onChange(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const Icon = getPlaceholderIcon(placeholder.type);
  const acceptedFormats = getAcceptedFormats(placeholder.type, placeholder.constraints?.acceptedFormats);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Label className="flex-1">
          {placeholder.name}
          {placeholder.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
      </div>

      {placeholder.description && (
        <p className="text-xs text-muted-foreground">{placeholder.description}</p>
      )}

      {/* File Input */}
      {["video", "audio", "image", "transcript"].includes(placeholder.type) && (
        <div className="relative">
          <input
            ref={inputRef}
            type="file"
            accept={acceptedFormats}
            onChange={handleFileSelect}
            className="hidden"
            id={`file-${placeholder.id}`}
          />

          {value?.type === "file" ? (
            <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-border bg-muted/50">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <span className="flex-1 truncate text-sm">
                {(value as { type: "file"; file: File }).file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              htmlFor={`file-${placeholder.id}`}
              className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed 
                cursor-pointer transition-colors
                ${error
                  ? "border-destructive bg-destructive/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                }
              `}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload {placeholder.type}
              </span>
            </label>
          )}
        </div>
      )}

      {/* Text Input */}
      {placeholder.type === "text" && (
        <Input
          value={
            value?.type === "text"
              ? (value as { type: "text"; value: string }).value
              : placeholder.defaultValue?.type === "text"
                ? (placeholder.defaultValue as { value: string }).value
                : ""
          }
          onChange={handleTextChange}
          placeholder={`Enter ${placeholder.name.toLowerCase()}`}
          className={`
            bg-background border-2
            ${error ? "border-destructive" : "border-border"}
          `}
        />
      )}

      {/* Number Input */}
      {placeholder.type === "number" && (
        <Input
          type="number"
          value={
            value?.type === "number"
              ? (value as { type: "number"; value: number }).value
              : ""
          }
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              onChange({ type: "number", value: num });
            } else {
              onChange(null);
            }
          }}
          min={placeholder.constraints?.minValue}
          max={placeholder.constraints?.maxValue}
          placeholder={`Enter ${placeholder.name.toLowerCase()}`}
          className={`
            bg-background border-2
            ${error ? "border-destructive" : "border-border"}
          `}
        />
      )}

      {/* Color Input */}
      {placeholder.type === "color" && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={
              value?.type === "color"
                ? (value as { type: "color"; value: string }).value
                : "#ffffff"
            }
            onChange={(e) => onChange({ type: "color", value: e.target.value })}
            className="w-10 h-10 rounded border-2 border-border cursor-pointer"
          />
          <Input
            value={
              value?.type === "color"
                ? (value as { type: "color"; value: string }).value
                : ""
            }
            onChange={(e) => onChange({ type: "color", value: e.target.value })}
            placeholder="#FFFFFF"
            className="flex-1 bg-background border-2 border-border"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Get the icon for a placeholder type.
 */
function getPlaceholderIcon(type: PlaceholderDefinition["type"]) {
  switch (type) {
    case "video":
      return Film;
    case "audio":
      return Music;
    case "image":
      return ImageIcon;
    case "text":
    case "font":
      return Type;
    default:
      return Upload;
  }
}

/**
 * Get accepted file formats for a placeholder type.
 */
function getAcceptedFormats(
  type: PlaceholderDefinition["type"],
  customFormats?: string[]
): string {
  if (customFormats && customFormats.length > 0) {
    return customFormats.map((f) => `.${f}`).join(",");
  }

  switch (type) {
    case "video":
      return "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";
    case "audio":
      return "audio/mpeg,audio/wav,audio/ogg,.mp3,.wav,.ogg";
    case "image":
      return "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
    case "transcript":
      return "video/*,audio/*";
    default:
      return "";
  }
}
