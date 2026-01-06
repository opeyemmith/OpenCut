import { storageService } from "@/lib/storage/storage-service";
import { useMediaStore } from "@/stores/media-store";
import { type GeneratedProject } from "@opencut/automation";
import { type TProject, type Scene } from "@/types/project";
import { type TimelineTrack, type TimelineElement } from "@/types/timeline";
import { type MediaFile } from "@/types/media";
import { toast } from "sonner";

/**
 * Creates a new OpenCut project from a generated automation project.
 * Handles the hydration of media files, creation of project structure,
 * and persistence to storage.
 */
export async function createProjectFromTemplate(
  generated: GeneratedProject
): Promise<string> {
  try {
    const { project: genProject, tracks: genTracks, mediaFiles: genMediaFiles } = generated;

    // 1. Create Project Structure
    const mainScene: Scene = {
      id: "main-scene-" + genProject.id,
      name: "Main Scene",
      isMain: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const project: TProject = {
      id: genProject.id,
      name: genProject.name,
      thumbnail: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      scenes: [mainScene],
      currentSceneId: mainScene.id,
      backgroundColor: genProject.backgroundColor,
      backgroundType: genProject.backgroundType,
      fps: genProject.fps,
      canvasSize: genProject.canvasSize,
      canvasMode: "custom", // Generated projects usually have specific dimensions
      bookmarks: [],
    };

    // 2. Persist Media Files
    // We need to add them to the media store/storage
    const mediaStore = useMediaStore.getState();
    const mediaIdMap = new Map<string, string>(); // genMediaId -> storedMediaId (usually same, but good to be safe)

    await Promise.all(
      genMediaFiles.map(async (genFile) => {
        // Create MediaFile object
        const mediaFile: Omit<MediaFile, "id"> = {
          name: genFile.name,
          type: genFile.type,
          file: genFile.file,
          duration: genFile.duration,
          width: genFile.width,
          height: genFile.height,
        };

        // We manually inject the ID to keep it consistent if possible, 
        // or let the store generate one. 
        // Typically automation uses UUIDs so we can reuse them.
        
        // However, useMediaStore.addMediaFile generates a new ID internally.
        // So we might need to bypass it or handle ID mapping.
        // For simplicity and safety, we'll assume we can pass the ID if we use storageService directly,
        // but using store is safer for cache updating.
        
        // Let's use storageService directly to ensure IDs match what's in the timeline elements
        const storedFile: MediaFile = {
            id: genFile.id,
            ...mediaFile
        };
        
        await storageService.saveMediaFile({ 
            projectId: project.id, 
            file: storedFile 
        });
        
        // Add implicit URL for preview if needed (usually handled by store/component)
      })
    );

    // 3. Persist Timeline
    // Convert generated tracks to TimelineTracks
    // The structures are nearly identical by design, but we ensure type safety
    const timelineTracks: TimelineTrack[] = genTracks.map((track) => ({
      id: track.id,
      name: track.name,
      type: track.type,
      muted: track.muted,
      isMain: track.isMain,
      elements: track.elements.map((el) => {
        // Map common properties
        const base = {
          id: el.id,
          name: el.name,
          duration: el.duration,
          startTime: el.startTime,
          trimStart: el.trimStart,
          trimEnd: el.trimEnd,
          hidden: el.hidden,
        };

        if (el.type === "media") {
           return {
             ...base,
             type: "media",
             mediaId: el.mediaId,
             muted: el.muted,
           } as TimelineElement;
        } else {
           return {
             ...base,
             type: "text",
             content: el.content,
             fontSize: el.fontSize,
             fontFamily: el.fontFamily,
             color: el.color,
             backgroundColor: el.backgroundColor,
             textAlign: el.textAlign,
             fontWeight: el.fontWeight,
             fontStyle: el.fontStyle,
             textDecoration: el.textDecoration,
             x: el.x,
             y: el.y,
             rotation: el.rotation,
             opacity: el.opacity,
           } as TimelineElement;
        }
      }),
    }));

    await storageService.saveTimeline({
        projectId: project.id,
        sceneId: mainScene.id,
        tracks: timelineTracks
    });

    // 4. Persist Project Metadata
    await storageService.saveProject({ project });

    return project.id;
  } catch (error) {
    console.error("Failed to create project from template:", error);
    toast.error("Failed to create project");
    throw error;
  }
}
