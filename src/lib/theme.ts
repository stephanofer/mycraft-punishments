/**
 * Theme configuration - Easily customizable colors
 * Edit these values to change the entire color scheme
 */

export const theme = {
  // Primary brand color - used for main actions and highlights
  primary: {
    DEFAULT: "#8B5CF6", // Purple
    hover: "#7C3AED",
    light: "#A78BFA",
    dark: "#6D28D9",
  },

  // Secondary color - used for secondary actions
  secondary: {
    DEFAULT: "#3B82F6", // Blue
    hover: "#2563EB",
    light: "#60A5FA",
    dark: "#1D4ED8",
  },

  // Accent color - used for special highlights
  accent: {
    DEFAULT: "#06B6D4", // Cyan
    hover: "#0891B2",
    light: "#22D3EE",
    dark: "#0E7490",
  },

  // Status colors
  success: {
    DEFAULT: "#10B981",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.3)",
  },
  warning: {
    DEFAULT: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  danger: {
    DEFAULT: "#EF4444",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.3)",
  },

  // Punishment type specific colors
  punishments: {
    ban: {
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.3)",
    },
    mute: {
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    warning: {
      color: "#FB923C",
      bg: "rgba(251, 146, 60, 0.15)",
      border: "rgba(251, 146, 60, 0.3)",
    },
    kick: {
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.15)",
      border: "rgba(59, 130, 246, 0.3)",
    },
  },

  // Background colors
  background: {
    DEFAULT: "#000000",
    secondary: "#0A0A0A",
    tertiary: "#111111",
  },

  // Surface colors (cards, modals, etc.)
  surface: {
    DEFAULT: "#141414",
    hover: "#1A1A1A",
    active: "#222222",
    border: "#262626",
  },

  // Text colors
  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    muted: "#71717A",
    disabled: "#52525B",
  },

  // Border colors
  border: {
    DEFAULT: "#27272A",
    light: "#3F3F46",
    focus: "#8B5CF6",
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
    accent: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
    danger: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    surface:
      "linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)",
  },
} as const;

// CSS custom properties to inject
export const themeCSS = `
:root {
  /* Primary */
  --color-primary: ${theme.primary.DEFAULT};
  --color-primary-hover: ${theme.primary.hover};
  --color-primary-light: ${theme.primary.light};
  --color-primary-dark: ${theme.primary.dark};
  
  /* Secondary */
  --color-secondary: ${theme.secondary.DEFAULT};
  --color-secondary-hover: ${theme.secondary.hover};
  
  /* Accent */
  --color-accent: ${theme.accent.DEFAULT};
  --color-accent-hover: ${theme.accent.hover};
  
  /* Status */
  --color-success: ${theme.success.DEFAULT};
  --color-warning: ${theme.warning.DEFAULT};
  --color-danger: ${theme.danger.DEFAULT};
  
  /* Punishments */
  --color-ban: ${theme.punishments.ban.color};
  --color-ban-bg: ${theme.punishments.ban.bg};
  --color-mute: ${theme.punishments.mute.color};
  --color-mute-bg: ${theme.punishments.mute.bg};
  --color-warning: ${theme.punishments.warning.color};
  --color-warning-bg: ${theme.punishments.warning.bg};
  --color-kick: ${theme.punishments.kick.color};
  --color-kick-bg: ${theme.punishments.kick.bg};
  
  /* Background */
  --bg-primary: ${theme.background.DEFAULT};
  --bg-secondary: ${theme.background.secondary};
  --bg-tertiary: ${theme.background.tertiary};
  
  /* Surface */
  --surface: ${theme.surface.DEFAULT};
  --surface-hover: ${theme.surface.hover};
  --surface-active: ${theme.surface.active};
  --surface-border: ${theme.surface.border};
  
  /* Text */
  --text-primary: ${theme.text.primary};
  --text-secondary: ${theme.text.secondary};
  --text-muted: ${theme.text.muted};
  
  /* Border */
  --border: ${theme.border.DEFAULT};
  --border-light: ${theme.border.light};
  --border-focus: ${theme.border.focus};
  
  /* Gradients */
  --gradient-primary: ${theme.gradients.primary};
  --gradient-accent: ${theme.gradients.accent};
}
`;

export type Theme = typeof theme;
