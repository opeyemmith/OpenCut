/**
 * Handoff Bridge
 * 
 * Handles the communication protocol between Dashboard and OpenCut Editor.
 * Since they run on different ports (origins), we use window.postMessage.
 */

import { NormalizedProject } from "@clipfactory/opencut-engine";

export interface HandoffPayload {
  type: "PROJECT_DATA";
  project: NormalizedProject;
  // For MVP, we pass media as a map of blobs if needed, or rely on them being accessible somehow
  // Ideally, if Editor is separate, we might need to send Blobs
  files?: Record<string, Blob>; 
}

export interface HandoffRequest {
  type: "HANDSHAKE_INIT";
}

export type HandoffMessage = HandoffPayload | HandoffRequest;

export class HandoffManager {
  private targetWindow: Window | null = null;
  private projectToSend: NormalizedProject | null = null;
  private origin: string;

  constructor(targetOrigin: string = "http://localhost:3000") {
    this.origin = targetOrigin;
  }

  public initiateHandoff(targetWindow: Window, project: NormalizedProject) {
    this.targetWindow = targetWindow;
    this.projectToSend = project;

    // Start listening for handshake
    window.addEventListener("message", this.handleMessage);

    // Also optimistically send in case editor is already loaded (re-opening)
    // Retry a few times
    let attempts = 0;
    const interval = setInterval(() => {
        if (attempts > 10 || !this.targetWindow || this.targetWindow.closed) {
            clearInterval(interval);
            return;
        }
        this.targetWindow.postMessage({ type: "CHECK_READY" }, this.origin);
        attempts++;
    }, 500);
  }

  private handleMessage = (event: MessageEvent) => {
    // Verify origin
    if (event.origin !== this.origin) return;

    if (event.data.type === "EDITOR_READY" && this.projectToSend && this.targetWindow) {
      console.log("[Handoff] Editor is ready. Sending project...");
      
      this.targetWindow.postMessage({
        type: "PROJECT_DATA",
        project: this.projectToSend,
        // files: ... TODO: Attach heavy media files here if needed
      }, this.origin);

      // Clean up after sending
      window.removeEventListener("message", this.handleMessage);
    }
  };
}

export const handoffManager = new HandoffManager();
