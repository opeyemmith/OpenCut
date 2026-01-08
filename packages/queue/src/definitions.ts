// ============================================
// Queue Name Constants
// ============================================

export const QUEUE_NAMES = {
  VIDEO_GENERATION: 'video-generation',
  ASSET_GENERATION: 'asset-generation',
  RENDER: 'render',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

// ============================================
// Redis Keys
// ============================================

export const REDIS_KEYS = {
  JOB_STATUS: (jobId: string) => `job:${jobId}:status`,
  USER_JOBS: (userId: string) => `user:${userId}:jobs`,
} as const;

// ============================================
// Defaults
// ============================================

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: {
    age: 24 * 3600, // keep for 24 hours
    count: 1000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600, // keep for 7 days for debugging
  },
};
