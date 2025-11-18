// EcoGo Brand Colors (2025 Guide)
export const BRAND_COLORS = {
  ecoGreen: "#2DB85B",
  darkCharcoal: "#2F3A3F",
  white: "#FFFFFF",
  lightGray: "#F3F3F3",
  midGray: "#DADADA",
  errorRed: "#E64A4A",

  // Legacy aliases (keep for compatibility)
  charcoalText: "#2D2D2D",
  ecoGrey: "#DADADA",
} as const;

// Helper function to get color by name
export const getColor = (colorName: keyof typeof BRAND_COLORS) =>
  BRAND_COLORS[colorName];
