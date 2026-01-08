import { Video, Image, FileVideo, Mic, Type, Wand2 } from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: "all" | "video" | "image" | "audio" | "text";
  icon: any;
  href: string;
  status: "available" | "coming_soon" | "beta";
  badge?: string;
}

export const tools: Tool[] = [
  {
    id: "short-video",
    title: "Short Videos",
    description: "Generate viral short-form videos from text or long videos automatically.",
    category: "video",
    icon: Video,
    href: "/create/short",
    status: "available",
  },
  {
    id: "long-video",
    title: "Long-form Videos",
    description: "Create documentary-style long videos with AI scripting and editing.",
    category: "video",
    icon: FileVideo,
    href: "/create/long",
    status: "available",
  },
  {
    id: "image-generation",
    title: "Image Generation",
    description: "Create stunning visuals from text prompts using advanced AI models.",
    category: "image",
    icon: Image,
    href: "/tools/image-gen",
    status: "available",
  },
  {
    id: "image-to-image",
    title: "Image to Image",
    description: "Transform existing images into new styles or variations.",
    category: "image",
    icon: Wand2,
    href: "/tools/img2img",
    status: "beta",
    badge: "New",
  },
  {
    id: "script-writer",
    title: "AI Script Writer",
    description: "Generate engaging scripts for your videos or podcasts.",
    category: "text",
    icon: Type,
    href: "/tools/script",
    status: "available",
  },
  {
    id: "voice-cloning",
    title: "Voice Cloning",
    description: "Clone your voice or use premium AI voices for narration.",
    category: "audio",
    icon: Mic,
    href: "/tools/voice",
    status: "coming_soon",
  },
];
