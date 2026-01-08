/**
 * Project Validator
 *
 * Runtime validation for ClipFactoryProject using Zod.
 * Use this to validate projects received from external sources
 * (API, file imports, AI workers, etc.)
 */

import { z } from "zod";
import type { ClipFactoryProject } from "../types/project";

// ============================================
// Zod Schemas
// ============================================

const ProjectTextStyleSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number().positive(),
  fontWeight: z.number().min(100).max(900),
  color: z.string(),
  backgroundColor: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]),
});

const ElementTransformSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
  rotation: z.number(),
  scale: z.number().positive(),
  opacity: z.number().min(0).max(1),
});

const ProjectElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["media", "text", "audio", "image"]),
  name: z.string(),
  startTime: z.number().nonnegative(),
  duration: z.number().nonnegative(),
  trimStart: z.number().nonnegative(),
  trimEnd: z.number().nonnegative(),
  assetId: z.string().optional(),
  textContent: z.string().optional(),
  textStyle: ProjectTextStyleSchema.optional(),
  transform: ElementTransformSchema.optional(),
  muted: z.boolean().optional(),
  hidden: z.boolean().optional(),
});

const TrackRoleSchema = z.enum([
  "main_video",
  "b_roll",
  "overlay",
  "background_music",
  "voiceover",
  "sound_effect",
  "caption",
  "title",
]);

const ProjectTrackSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["video", "audio", "text", "image"]),
  role: TrackRoleSchema,
  order: z.number().int().nonnegative(),
  muted: z.boolean(),
  locked: z.boolean(),
  elements: z.array(ProjectElementSchema),
});

const AssetItemSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  type: z.enum(["video", "audio", "image"]),
  path: z.string(),
  mimeType: z.string(),
  size: z.number().nonnegative(),
  duration: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

const ProjectCanvasSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  fps: z.number().positive(),
  backgroundColor: z.string(),
  backgroundType: z.enum(["color", "blur"]),
});

const ProjectMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  duration: z.number().nonnegative(),
  templateId: z.string().optional(),
  generationJobId: z.string().optional(),
});

export const ClipFactoryProjectSchema = z.object({
  version: z.string(),
  metadata: ProjectMetadataSchema,
  canvas: ProjectCanvasSchema,
  tracks: z.array(ProjectTrackSchema),
  assets: z.object({
    items: z.array(AssetItemSchema),
  }),
});

// ============================================
// Validation Functions
// ============================================

/**
 * Validate and parse a ClipFactoryProject.
 * Throws ZodError if validation fails.
 */
export function validateProject(data: unknown): ClipFactoryProject {
  return ClipFactoryProjectSchema.parse(data) as ClipFactoryProject;
}

/**
 * Check if data is a valid ClipFactoryProject without throwing.
 */
export function isValidProject(data: unknown): data is ClipFactoryProject {
  return ClipFactoryProjectSchema.safeParse(data).success;
}

/**
 * Validate with detailed error messages.
 */
export function validateProjectSafe(data: unknown): {
  success: true;
  data: ClipFactoryProject;
} | {
  success: false;
  errors: z.ZodError;
} {
  const result = ClipFactoryProjectSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as ClipFactoryProject };
  }
  return { success: false, errors: result.error };
}
