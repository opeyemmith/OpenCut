/**
 * Template Types
 *
 * Shared type definitions for the template system.
 * These are platform-agnostic and used across the entire platform.
 */

import type { ClipFactoryProject } from "./project";

// ============================================
// Template Categories
// ============================================

/**
 * Template category determines what aspect of a video the template controls.
 * - structure: Timeline layout (track order, element positioning)
 * - style: Visual appearance (fonts, colors, transitions)
 * - logic: Generation rules (pacing, clip selection)
 * - full: Complete template with all aspects
 */
export type TemplateCategory = "structure" | "style" | "logic" | "full";

// ============================================
// Template Definition
// ============================================

export interface Template {
  id: string;
  name: string;
  description: string;
  
  /** Template version for tracking changes */
  version: number;
  
  /** What aspect of video this template controls */
  category: TemplateCategory;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Template content
  schema: TemplateSchema;
  placeholders: PlaceholderDefinition[];
  
  // Metadata
  thumbnail?: string;
  duration: number;
  tags: string[];
  
  /** AI generation metadata */
  aiMetadata?: AITemplateMetadata;
}

// ============================================
// AI Template Metadata
// ============================================

export interface AITemplateMetadata {
  /** Prompt hints to guide AI generation */
  promptHints?: string[];
  /** Default duration when generating videos from this template */
  defaultDuration?: number;
  /** Suggested visual styles */
  suggestedStyles?: string[];
  /** Rules for element timing/pacing */
  timingRules?: TimingRules;
}

export interface TimingRules {
  /** Minimum clip duration in seconds */
  minClipDuration: number;
  /** Maximum clip duration in seconds */
  maxClipDuration: number;
  /** Default transition duration in seconds */
  transitionDuration: number;
  /** Pacing style for the video */
  pacingStyle: "fast" | "medium" | "slow";
}

// ============================================
// Template Schema
// ============================================

export interface TemplateSchema {
  version: string;
  canvas: CanvasSettings;
  tracks: TemplateTrack[];
  
  /** Reusable style rules */
  styleRules?: StyleRules;
}

export interface StyleRules {
  /** Default text style for captions */
  captionStyle?: TextStyle;
  /** Default text style for titles */
  titleStyle?: TextStyle;
  /** Color palette for the template */
  colorPalette?: string[];
  /** Font stack in order of preference */
  fontStack?: string[];
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
  /** The generated ClipFactory project */
  projectData: ClipFactoryProject;
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
  category: TemplateCategory;
  createdAt: Date;
}
