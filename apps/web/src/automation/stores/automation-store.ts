import { create } from 'zustand';
import type { OpenCutProject, OpenCutTrack, MediaFileInfo } from "@opencut/automation";

interface AutomationStore {
  isExtractDialogOpen: boolean;
  extractionSource: {
    project: OpenCutProject | null;
    tracks: OpenCutTrack[];
    mediaFiles: MediaFileInfo[];
  };
  openExtractDialog: (project: OpenCutProject, tracks: OpenCutTrack[], mediaFiles: MediaFileInfo[]) => void;
  closeExtractDialog: () => void;
}

export const useAutomationStore = create<AutomationStore>((set) => ({
  isExtractDialogOpen: false,
  extractionSource: {
    project: null,
    tracks: [],
    mediaFiles: [],
  },
  openExtractDialog: (project, tracks, mediaFiles) => 
    set({ 
      isExtractDialogOpen: true, 
      extractionSource: { project, tracks, mediaFiles } 
    }),
  closeExtractDialog: () => 
    set({ 
      isExtractDialogOpen: false,
      extractionSource: { project: null, tracks: [], mediaFiles: [] } 
    }),
}));
