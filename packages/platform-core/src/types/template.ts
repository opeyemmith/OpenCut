/**
 * Template Types
 *
 * Shared type definitions for the template system.
 * These are platform-agnostic and used across the entire platform.
 */

// ============================================
// Template Definition
// ============================================

export interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Template content
  schema: TemplateSchema;
  placeholders: PlaceholderDefinition[];
  
  // Metadata
  thumbnail?: string;
  duration: number;
  tags: string[];
}

export interface TemplateSchema {
  version: string;
  canvas: CanvasSettings;
  tracks: TemplateTrack[];
}

export interface CanvasSettings {
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
}

export interface TemplateTrack {
  id: string;
  type: "video" | "audio" | "text" | "image";
  order: number;
  elements: TemplateElement[];
}

export interface TemplateElement {
  id: string;
  type: "media" | "text" | "placeholder";
  startTime: number;
  duration: number;
  
  // For placeholder elements
  placeholderId?: string;
  
  // For text elements
  textContent?: string;
  textStyle?: TextStyle;
  
  // For media elements
  mediaRef?: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  backgroundColor?: string;
  textAlign: "left" | "center" | "right";
}

// ============================================
// Placeholders
// ============================================

export interface PlaceholderDefinition {
  id: string;
  name: string;
  description: string;
  type: PlaceholderType;
  required: boolean;
  defaultValue?: string;
  constraints?: PlaceholderConstraints;
}

export type PlaceholderType = 
  | "text"
  | "media"
  | "audio"
  | "color"
  | "number"
  | "duration";

export interface PlaceholderConstraints {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  allowedFormats?: string[];
  pattern?: string;
}

// ============================================
// Template Application
// ============================================

export interface TemplateInputs {
  [placeholderId: string]: PlaceholderValue;
}

export type PlaceholderValue = 
  | string 
  | number 
  | { type: "media"; path: string };

export interface GeneratedProject {
  id: string;
  name: string;
  templateId: string;
  createdAt: Date;
  inputs: TemplateInputs;
  projectData: unknown; // OpenCut project JSON
}

// ============================================
// Template Summary (for listings)
// ============================================

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  duration: number;
  placeholderCount: number;
  createdAt: Date;
}
