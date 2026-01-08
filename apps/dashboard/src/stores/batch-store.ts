import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BatchJob, BatchJobStatus, BatchDataSource, BatchExportSettings } from '@clipfactory/platform-core/types';
import { v4 as uuidv4 } from 'uuid';

interface BatchStore {
  jobs: BatchJob[];
  activeJobId: string | null;
  
  // Actions
  createJob: (
    name: string, 
    templateId: string, 
    dataSource: BatchDataSource, 
    settings: BatchExportSettings
  ) => string; // Returns new Job ID
  
  deleteJob: (jobId: string) => void;
  getJob: (jobId: string) => BatchJob | undefined;
  
  updateJobStatus: (jobId: string, status: BatchJobStatus) => void;
  updateJobProgress: (jobId: string, completed: number, failed: number) => void;
  
  setActiveJob: (jobId: string | null) => void;
}

export const useBatchStore = create<BatchStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      activeJobId: null,

      createJob: (name, templateId, dataSource, settings) => {
        const newJob: BatchJob = {
          id: uuidv4(),
          name,
          templateId,
          status: 'queued',
          dataSource,
          settings,
          totalItems: dataSource.data.length,
          completedItems: 0,
          failedItems: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          jobs: [newJob, ...state.jobs],
          activeJobId: newJob.id,
        }));

        return newJob.id;
      },

      deleteJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== jobId),
          activeJobId: state.activeJobId === jobId ? null : state.activeJobId,
        }));
      },

      getJob: (jobId) => {
        return get().jobs.find((j) => j.id === jobId);
      },

      updateJobStatus: (jobId, status) => {
        set((state) => ({
          jobs: state.jobs.map((j) => 
            j.id === jobId 
              ? { ...j, status, updatedAt: new Date() } 
              : j
          ),
        }));
      },

      updateJobProgress: (jobId, completed, failed) => {
        set((state) => ({
          jobs: state.jobs.map((j) => 
            j.id === jobId 
              ? { ...j, completedItems: completed, failedItems: failed, updatedAt: new Date() } 
              : j
          ),
        }));
      },
      
      setActiveJob: (jobId) => set({ activeJobId: jobId }),
    }),
    {
      name: 'opencut-batch-store',
      // We might want to use a custom storage adapter here later, 
      // but for now localStorage is fine for job metadata
    }
  )
);
