export type BatchJobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type DataSourceType = 'csv' | 'json';

export interface BatchDataSource {
  type: DataSourceType;
  fileName: string;
  data: Record<string, any>[]; // Array of row data
  mappings: Record<string, string>; // Map of CSV Header -> Template Placeholder
}

export interface BatchItem {
  id: string; // Unique ID for this specific generation (e.g. row index + timestamp)
  jobId: string;
  status: 'pending' | 'success' | 'failed';
  data: Record<string, any>; // The specific row data used for this item
  outputProjectId?: string; // ID of the generated OpenCut project
  error?: string;
}

export interface BatchExportSettings {
  namingPattern: string; // e.g., "Video_{product_name}"
  autoExport: boolean; // If true, automatically trigger rendering after generation
}

export interface BatchJob {
  id: string;
  name: string;
  templateId: string;
  status: BatchJobStatus;
  
  dataSource: BatchDataSource;
  settings: BatchExportSettings;
  
  totalItems: number;
  completedItems: number;
  failedItems: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Optional: We might want to store the list of item IDs here, or fetch them separately
  // items?: BatchItem[]; 
}
