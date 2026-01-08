export type CharacterStyle = 
  | "realistic" 
  | "disney" 
  | "anime" 
  | "3d-cartoon" 
  | "painting" 
  | "comic" 
  | "clay" 
  | "cyberpunk" 
  | "gta" 
  | "epic" 
  | "kid-story"
  | "suspense";

export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  createdAt: string;
  usageCount: number;
  isPublic: boolean;
  author?: string;
  age: "child" | "young" | "middle" | "senior";
  gender: "male" | "female" | "other";
  style: CharacterStyle;
}

export const styleOptions = [
  { id: "realistic", name: "Realistic" },
  { id: "disney", name: "Disney" },
  { id: "anime", name: "Anime" },
  { id: "3d-cartoon", name: "3D Cartoon" },
  { id: "painting", name: "Painting" },
  { id: "comic", name: "Comic" },
  { id: "clay", name: "Clay" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "gta", name: "GTA" },
  { id: "epic", name: "Epic" },
  { id: "kid-story", name: "Kid Story" },
  { id: "suspense", name: "Suspense" },
];

export const ageOptions = [
  { id: "child", name: "Child (0-17)" },
  { id: "young", name: "Young (18-35)" },
  { id: "middle", name: "Middle (36-55)" },
  { id: "senior", name: "Senior (55+)" },
];

export const genderOptions = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "other", name: "Other" },
];

// Sample private characters (user's own)
export const sampleCharacters: Character[] = [
  {
    id: "1",
    name: "Alex the Narrator",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop",
    description: "A confident professional with a warm, engaging presence. Perfect for business and documentary content.",
    createdAt: "2024-01-05",
    usageCount: 24,
    isPublic: false,
    age: "middle",
    gender: "male",
    style: "realistic",
  },
  {
    id: "2",
    name: "Maya",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop",
    description: "Energetic and relatable young woman who connects with modern audiences. Great for social media content.",
    createdAt: "2024-01-03",
    usageCount: 18,
    isPublic: false,
    age: "young",
    gender: "female",
    style: "realistic",
  },
  {
    id: "3",
    name: "Professor Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    description: "Knowledgeable and patient senior figure. Ideal for educational and instructional content.",
    createdAt: "2024-01-01",
    usageCount: 12,
    isPublic: false,
    age: "senior",
    gender: "male",
    style: "painting",
  },
];

// Sample public/community characters
export const publicCharacters: Character[] = [
  {
    id: "pub-1",
    name: "TechTalk Tom",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop",
    description: "Tech enthusiast who breaks down complex topics. Perfect for tech reviews and tutorials.",
    createdAt: "2024-01-02",
    usageCount: 1250,
    isPublic: true,
    author: "ClipFactory Team",
    age: "young",
    gender: "male",
    style: "cyberpunk",
  },
  {
    id: "pub-2",
    name: "Storyteller Sarah",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop",
    description: "Warm and captivating personality. Creates emotional connections with audiences.",
    createdAt: "2024-01-01",
    usageCount: 980,
    isPublic: true,
    author: "ClipFactory Team",
    age: "middle",
    gender: "female",
    style: "disney",
  },
  {
    id: "pub-3",
    name: "Coach Marcus",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    description: "Motivational fitness coach. High energy, encouraging, and action-oriented.",
    createdAt: "2023-12-28",
    usageCount: 756,
    isPublic: true,
    author: "FitContent Pro",
    age: "middle",
    gender: "male",
    style: "3d-cartoon",
  },
  {
    id: "pub-4",
    name: "Luna the Educator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    description: "Fun and engaging young woman. Perfect for lifestyle and educational content.",
    createdAt: "2023-12-25",
    usageCount: 654,
    isPublic: true,
    author: "EduKids",
    age: "young",
    gender: "female",
    style: "anime",
  },
];
