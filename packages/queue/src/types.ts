import type { ClipFactoryProject, Template } from '@clipfactory/platform-core/types';

// ============================================
// Job Data Interfaces
// ============================================

export interface BaseJobData {
  userId: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

export interface VideoGenerationJob extends BaseJobData {
  type: 'video';
  prompt: string;
  duration: number;
  templateId?: string;
  templateData?: Partial<Template>;
  style?: {
    mood?: string;
    pacing?: 'fast' | 'medium' | 'slow';
    ratio?: '16:9' | '9:16' | '1:1';
  };
}

export interface AssetGenerationJob extends BaseJobData {
  type: 'asset';
  assetType: 'image' | 'voice' | 'music' | 'caption';
  prompt: string;
  duration?: number; // for audio/video assets
  context?: {
     sceneId: string;
     scriptContent?: string;
  };
}

export interface RenderJob extends BaseJobData {
  type: 'render';
  projectId: string; // Required for render
  project: ClipFactoryProject;
  settings: {
    resolution: '720p' | '1080p' | '4k';
    format: 'mp4' | 'mov';
    quality: 'low' | 'medium' | 'high';
  };
}

// Union type for all job data
export type ClipFactoryJobData = 
  | VideoGenerationJob 
  | AssetGenerationJob 
  | RenderJob;

// ============================================
// Job Status
// ============================================

export type JobStatus = 
  | 'queued' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface JobProgress {
  status: JobStatus;
  progress: number; // 0-100
  step?: string;
  error?: string;
  result?: any;
}
