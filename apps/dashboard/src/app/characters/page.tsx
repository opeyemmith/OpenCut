"use client";

import { useState } from "react";
import { Plus, Users, Search, Lock, Globe } from "lucide-react";
import { Character, sampleCharacters, publicCharacters, ageOptions, genderOptions, styleOptions } from "@/lib/characters-data";
import { CharacterCard } from "@/components/characters/character-card";
import { CreateCharacterDialog } from "@/components/characters/create-character-dialog";
import { CharacterDetailsDialog } from "@/components/characters/character-details-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TabType = "private" | "public";

export default function CharactersPage() {
  const [myCharacters, setMyCharacters] = useState<Character[]>(sampleCharacters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("private");
  
  // Filters
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Get characters based on active tab
  const sourceCharacters = activeTab === "private" ? myCharacters : publicCharacters;

  // Apply filters
  const filteredCharacters = sourceCharacters
    .filter((char) => {
      const matchesSearch =
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAge = ageFilter === "all" || char.age === ageFilter;
      const matchesGender = genderFilter === "all" || char.gender === genderFilter;
      const matchesStyle = styleFilter === "all" || char.style === styleFilter;
      return matchesSearch && matchesAge && matchesGender && matchesStyle;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "usage":
          return b.usageCount - a.usageCount;
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleCreate = (data: Omit<Character, "id" | "createdAt" | "usageCount" | "isPublic">) => {
    const newCharacter: Character = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
      isPublic: false,
    };
    setMyCharacters((prev) => [newCharacter, ...prev]);
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMyCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUse = (character: Character) => {
    if (activeTab === "private") {
      setMyCharacters((prev) =>
        prev.map((c) =>
          c.id === character.id ? { ...c, usageCount: c.usageCount + 1 } : c
        )
      );
    }
    console.log("Using character:", character.name);
  };

  const handleClone = (character: Character) => {
    const clonedCharacter: Character = {
      ...character,
      id: Date.now().toString(),
      name: `${character.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
      isPublic: false,
      author: undefined,
    };
    setMyCharacters((prev) => [clonedCharacter, ...prev]);
    // Switch to private tab to show the cloned character
    setActiveTab("private");
  };

  const clearFilters = () => {
    setAgeFilter("all");
    setGenderFilter("all");
    setStyleFilter("all");
    setSortBy("recent");
    setSearchQuery("");
  };

  const hasActiveFilters = ageFilter !== "all" || genderFilter !== "all" || styleFilter !== "all" || searchQuery !== "";

  return (
    <div className="p-8 max-w-[1400px] animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[var(--accent-subtle)]">
                <Users className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Characters
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Create and manage AI characters with unique voices, personalities, and styles for your videos.
            </p>
          </div>

          <button
            onClick={() => { setEditingCharacter(null); setIsDialogOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-5 h-5" />
            Create Character
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] mb-8">
        <button
          onClick={() => setActiveTab("private")}
          className={`relative px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "private"
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            My Characters
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === "private" 
                ? "bg-[var(--accent)]/10 text-[var(--accent)]" 
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }`}>
              {myCharacters.length}
            </span>
          </div>
          {activeTab === "private" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("public")}
          className={`relative px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "public"
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Public Library
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === "public" 
                ? "bg-[var(--accent)]/10 text-[var(--accent)]" 
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }`}>
              {publicCharacters.length}
            </span>
          </div>
          {activeTab === "public" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="h-10 w-[140px] bg-[var(--bg-card)] border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-[var(--accent)]">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="all">All Genders</SelectItem>
              {genderOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="h-10 w-[140px] bg-[var(--bg-card)] border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-[var(--accent)]">
              <SelectValue placeholder="All Ages" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="all">All Ages</SelectItem>
              {ageOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="h-10 w-[140px] bg-[var(--bg-card)] border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-[var(--accent)]">
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="all">All Styles</SelectItem>
              {styleOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-[140px] bg-[var(--bg-card)] border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-[var(--accent)]">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="usage">Most Used</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Characters Grid */}
      {/* Characters Grid */}
      {(activeTab === "private" || filteredCharacters.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card - Always first in private tab */}
          {activeTab === "private" && (
            <article
              onClick={() => { setEditingCharacter(null); setIsDialogOpen(true); }}
              className="min-h-[380px] border-2 border-dashed border-[var(--border-default)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]/10 transition-all duration-300 group h-full"
            >
              <div className="text-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors px-6">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[var(--accent)]/10">
                  <Plus className="w-8 h-8 group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <span className="font-medium text-lg">Create New Character</span>
                <p className="text-sm mt-3 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  Design a unique character with custom appearance and voice for your videos.
                </p>
              </div>
            </article>
          )}

          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={activeTab === "private" ? handleEdit : undefined}
              onDelete={activeTab === "private" ? handleDelete : undefined}
              onUse={handleUse}
              onClone={activeTab === "public" ? handleClone : undefined}
              onClick={setSelectedCharacter}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {hasActiveFilters ? "No characters found" : "No characters yet"}
          </h3>
          <p className="text-[var(--text-muted)] max-w-md mb-6">
            {hasActiveFilters
              ? "Try adjusting your filters or search query."
              : "No public characters available yet."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Empty Search State for Private Tab */}
      {activeTab === "private" && filteredCharacters.length === 0 && hasActiveFilters && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">No characters found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <CreateCharacterDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingCharacter(null); }}
        onSave={handleCreate}
        editCharacter={editingCharacter}
      />

      {/* Character Details Dialog */}
      <CharacterDetailsDialog
        isOpen={!!selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        character={selectedCharacter}
        onEdit={activeTab === "private" ? handleEdit : undefined}
        onDelete={activeTab === "private" ? handleDelete : undefined}
        onUse={handleUse}
        onClone={activeTab === "public" ? handleClone : undefined}
      />
    </div>
  );
}
