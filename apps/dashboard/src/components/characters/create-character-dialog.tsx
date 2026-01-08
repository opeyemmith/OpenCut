"use client";

import { useState } from "react";
import { X, Upload, User } from "lucide-react";
import { Character, ageOptions, genderOptions, styleOptions } from "@/lib/characters-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Omit<Character, "id" | "createdAt" | "usageCount" | "isPublic">) => void;
  editCharacter?: Character | null;
}

export function CreateCharacterDialog({
  isOpen,
  onClose,
  onSave,
  editCharacter,
}: CreateCharacterDialogProps) {
  const [name, setName] = useState(editCharacter?.name || "");
  const [description, setDescription] = useState(editCharacter?.description || "");
  const [age, setAge] = useState<Character["age"]>(editCharacter?.age || "young");
  const [gender, setGender] = useState<Character["gender"]>(editCharacter?.gender || "male");
  const [style, setStyle] = useState<Character["style"]>(editCharacter?.style || "realistic");
  const [avatar, setAvatar] = useState(editCharacter?.avatar || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSave({
      name,
      avatar,
      description,
      age,
      gender,
      style,
    });

    // Reset form
    setName("");
    setDescription("");
    setAge("young");
    setGender("male");
    setStyle("realistic");
    setAvatar("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {editCharacter ? "Edit Character" : "Create Character"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border-default)] flex items-center justify-center cursor-pointer hover:border-[var(--accent)] transition-colors">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[var(--text-muted)]" />
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-[var(--text-secondary)]">
              Character Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex the Narrator"
              className="mt-1.5 bg-[var(--bg-elevated)] border-[var(--border-default)]"
              required
            />
          </div>

          {/* Gender, Age & Style Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Gender */}
            <div>
              <Label className="text-[var(--text-secondary)]">Gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Character["gender"])}
                className="mt-1.5 w-full h-10 px-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {genderOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div>
              <Label className="text-[var(--text-secondary)]">Age Group</Label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value as Character["age"])}
                className="mt-1.5 w-full h-10 px-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {ageOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <Label className="text-[var(--text-secondary)]">Style</Label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as Character["style"])}
                className="mt-1.5 w-full h-10 px-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {styleOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-[var(--text-secondary)]">
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this character's appearance, style, and what they're best suited for..."
              rows={3}
              className="mt-1.5 w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white"
            >
              {editCharacter ? "Save Changes" : "Create Character"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
