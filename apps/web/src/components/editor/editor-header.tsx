"use client";

import { Button } from "../ui/button";
import { ChevronDown, ArrowLeft, SquarePen, Trash, Sparkles } from "lucide-react";
import { HeaderBase } from "../header-base";
import { useProjectStore } from "@/stores/project-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { useMediaStore } from "@/stores/media-store";
import { KeyboardShortcutsHelp } from "../keyboard-shortcuts-help";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { RenameProjectDialog } from "../rename-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import { useRouter } from "next/navigation";
import { FaDiscord } from "react-icons/fa6";
import { PanelPresetSelector } from "./panel-preset-selector";
import { ExportButton } from "./export-button";
import { ThemeToggle } from "../theme-toggle";
import { SaveTemplateDialog } from "@/automation";
import { useAutomationStore } from "@/automation/stores/automation-store";
import type { OpenCutProject, OpenCutTrack, MediaFileInfo } from "@opencut/automation";
import type { MediaFile } from "@/types/media";

export function EditorHeader() {
  const { activeProject, renameProject, deleteProject } = useProjectStore();
  const { tracks } = useTimelineStore();
  const { mediaFiles } = useMediaStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const { openExtractDialog, isExtractDialogOpen, closeExtractDialog, extractionSource } = useAutomationStore();
  const router = useRouter();

  const handleNameSave = async (newName: string) => {
    console.log("handleNameSave", newName);
    if (activeProject && newName.trim() && newName !== activeProject.name) {
      try {
        await renameProject(activeProject.id, newName.trim());
        setIsRenameDialogOpen(false);
      } catch (error) {
        console.error("Failed to rename project:", error);
      }
    }
  };

  const handleDelete = () => {
    if (activeProject) {
      deleteProject(activeProject.id);
      setIsDeleteDialogOpen(false);
      router.push("/projects");
    }
  };

  // Convert project data for automation template extraction
  const handleSaveAsTemplate = () => {
    if (!activeProject || !tracks) return;

    // Convert to automation-compatible format
    const project: OpenCutProject = {
      id: activeProject.id,
      name: activeProject.name,
      canvasSize: activeProject.canvasSize,
      backgroundColor: activeProject.backgroundColor,
      backgroundType: activeProject.backgroundType,
      fps: activeProject.fps,
    };

    // Convert tracks
    const automationTracks: OpenCutTrack[] = tracks.map((track) => ({
      id: track.id,
      name: track.name,
      type: track.type,
      elements: track.elements,
      muted: track.muted,
      isMain: track.isMain,
    }));

    // Convert media files to file info (filter out ephemeral items)
    const mediaFileInfos: MediaFileInfo[] = mediaFiles
      .filter((item: MediaFile) => !item.ephemeral)
      .map((item: MediaFile) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        duration: item.duration,
        width: item.width,
        height: item.height,
      }));

    openExtractDialog(project, automationTracks, mediaFileInfos);
  };

  const leftContent = (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-auto py-1.5 px-2.5 flex items-center justify-center"
          >
            <ChevronDown className="text-muted-foreground" />
            <span className="text-[0.85rem] mr-2">{activeProject?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 z-100">
          <Link href="/projects">
            <DropdownMenuItem className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Projects
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="flex items-center gap-1.5"
            onClick={() => setIsRenameDialogOpen(true)}
          >
            <SquarePen className="h-4 w-4" />
            Rename project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-1.5"
            onClick={handleSaveAsTemplate}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Save as Template
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-1.5"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            Delete Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="https://discord.gg/zmR9N35cjK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <FaDiscord className="h-4 w-4" />
              Discord
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameProjectDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onConfirm={handleNameSave}
        projectName={activeProject?.name || ""}
      />
      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        projectName={activeProject?.name || ""}
      />
      <SaveTemplateDialog
        isOpen={isExtractDialogOpen}
        onOpenChange={(open) => !open && closeExtractDialog()}
        onSuccess={(templateId) => {
          console.log("Template saved:", templateId);
        }}
      />
    </div>
  );

  const rightContent = (
    <nav className="flex items-center gap-2">
      <PanelPresetSelector />
      <KeyboardShortcutsHelp />
      <ExportButton />
      <ThemeToggle />
    </nav>
  );

  return (
    <HeaderBase
      leftContent={leftContent}
      rightContent={rightContent}
      className="bg-background h-[3.2rem] px-3 items-center mt-0.5"
    />
  );
}
