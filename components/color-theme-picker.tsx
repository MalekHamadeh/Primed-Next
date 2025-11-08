"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

export interface ColorTheme {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
  isDark: boolean;
  // Optional brand-specific tokens
  brandBarBg?: string;
  brandBarText?: string;
}

export const colorThemes: ColorTheme[] = [
  // Primed theme
  {
    id: "primed",
    name: "Primed (Teal + Deep Green)",
    background: "#112726",
    text: "#FFFFFF",
    accent: "#14B8A6",
    isDark: true,
    brandBarBg: "#00413c",
    brandBarText: "#14B8A6",
  },
  // Dark variants
  {
    id: "dark-1",
    name: "Current (Black + Teal)",
    background: "#0D1F1E",
    text: "#FFFFFF",
    accent: "#14B8A6",
    isDark: true,
  },
  {
    id: "dark-2",
    name: "Pure Black + Sky Blue",
    background: "#000000",
    text: "#FFFFFF",
    accent: "#60A5FA",
    isDark: true,
  },
  {
    id: "dark-3",
    name: "Navy + Mint",
    background: "#0F172A",
    text: "#FFFFFF",
    accent: "#34D399",
    isDark: true,
  },
  {
    id: "dark-4",
    name: "Slate + Lavender",
    background: "#1E293B",
    text: "#FFFFFF",
    accent: "#A78BFA",
    isDark: true,
  },
  {
    id: "dark-5",
    name: "Deep Teal + Coral",
    background: "#134E4A",
    text: "#FFFFFF",
    accent: "#FB7185",
    isDark: true,
  },
  // Light variants
  {
    id: "light-1",
    name: "White + Deep Teal",
    background: "#FFFFFF",
    text: "#0F172A",
    accent: "#0D9488",
    isDark: false,
  },
  {
    id: "light-2",
    name: "Sky + Navy",
    background: "#EFF6FF",
    text: "#1E293B",
    accent: "#1E40AF",
    isDark: false,
  },
  {
    id: "light-3",
    name: "Mint + Forest",
    background: "#F0FDF4",
    text: "#0F172A",
    accent: "#059669",
    isDark: false,
  },
  {
    id: "light-4",
    name: "Lavender + Purple",
    background: "#F5F3FF",
    text: "#1E293B",
    accent: "#7C3AED",
    isDark: false,
  },
  {
    id: "light-5",
    name: "Peach + Coral",
    background: "#FFF7ED",
    text: "#0F172A",
    accent: "#EA580C",
    isDark: false,
  },
];

export function getThemeById(id: string): ColorTheme {
  const fallback = colorThemes.find((t) => t.id === "primed") ?? colorThemes[0];
  const found = colorThemes.find((t) => t.id === id);
  return found ?? fallback;
}

interface ColorThemePickerProps {
  onThemeChange: (theme: ColorTheme) => void;
}

export default function ColorThemePicker({
  onThemeChange,
}: ColorThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const savedThemeId = localStorage.getItem("hero-color-theme");
      if (savedThemeId) {
        const theme = colorThemes.find((t) => t.id === savedThemeId);
        if (theme) return theme;
      }
    }
    return colorThemes[0];
  });

  useEffect(() => {
    onThemeChange(selectedTheme);
    window.dispatchEvent(new Event("theme-changed"));
  }, [onThemeChange, selectedTheme]);

  const handleThemeSelect = (theme: ColorTheme) => {
    setSelectedTheme(theme);
    localStorage.setItem("hero-color-theme", theme.id);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-20 left-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-shadow border border-gray-200 flex items-center gap-2"
        title="Change color theme"
      >
        <Palette className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Colors</span>
      </button>

      {/* Color picker panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80 max-h-[600px] overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">
            Choose Color Theme
          </h3>

          {/* Dark themes */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Dark Themes
            </p>
            <div className="space-y-2">
              {colorThemes
                .filter((theme) => theme.isDark)
                .map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                      selectedTheme.id === theme.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: theme.background }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-1 text-left">
                      {theme.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Light themes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Light Themes
            </p>
            <div className="space-y-2">
              {colorThemes
                .filter((theme) => !theme.isDark)
                .map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                      selectedTheme.id === theme.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: theme.background }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-1 text-left">
                      {theme.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
