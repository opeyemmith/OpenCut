"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FieldMapperProps {
  csvHeaders: string[];
  placeholders: string[]; // e.g. ["{{title}}", "{{price}}", "{{image}}"]
  onMappingComplete: (mapping: Record<string, string>) => void;
  className?: string;
}

export function FieldMapper({ csvHeaders, placeholders, onMappingComplete, className }: FieldMapperProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  
  // Auto-map if headers match placeholders exactly (ignoring braces)
  useEffect(() => {
    const initialMappings: Record<string, string> = {};
    let hasAutoMapped = false;

    placeholders.forEach(placeholder => {
        const cleanName = placeholder.replace(/{{|}}/g, '').trim().toLowerCase();
        const matchingHeader = csvHeaders.find(h => h.toLowerCase() === cleanName);
        if (matchingHeader) {
            initialMappings[placeholder] = matchingHeader;
            hasAutoMapped = true;
        }
    });

    if (hasAutoMapped) {
        setMappings(prev => ({ ...prev, ...initialMappings }));
    }
  }, [csvHeaders, placeholders]);

  // Notify parent whenever mappings change
  useEffect(() => {
    const isComplete = placeholders.every(p => !!mappings[p]);
    if (isComplete) {
        onMappingComplete(mappings);
    }
  }, [mappings, placeholders, onMappingComplete]);

  const handleSelect = (placeholder: string, header: string) => {
    setMappings(prev => ({
        ...prev,
        [placeholder]: header
    }));
  };

  return (
    <div className={cn("space-y-6", className)}>
        <div className="grid gap-4">
            {placeholders.map((placeholder) => {
                const isMapped = !!mappings[placeholder];
                const cleanName = placeholder.replace(/{{|}}/g, '');

                return (
                    <div key={placeholder} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border">
                        <div className="flex flex-col gap-1">
                            <Label className="font-mono text-sm text-primary">{placeholder}</Label>
                            <span className="text-xs text-muted-foreground">Template Field</span>
                        </div>

                        <ArrowRight className="w-4 h-4 text-muted-foreground" />

                        <div className="w-[250px]">
                            <Select 
                                value={mappings[placeholder] || ""} 
                                onValueChange={(val) => handleSelect(placeholder, val)}
                            >
                                <SelectTrigger className={cn("bg-background", isMapped && "border-green-500/50 ring-green-500/20")}>
                                    <SelectValue placeholder="Select CSV Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {csvHeaders.map(header => (
                                        <SelectItem key={header} value={header}>
                                            {header}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="w-8 flex justify-center">
                            {isMapped && <Check className="w-5 h-5 text-green-500" />}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
