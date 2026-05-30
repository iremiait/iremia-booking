import { supabase } from './supabase';

export const DEFAULT_THEME = {
  color_primary: '#1B7B7E',
  color_primary_dark: '#0D5456',
  color_primary_light: '#4FA5A8',
  color_primary_50: '#f0fdfa',
  color_primary_100: '#ccfbf1',
  color_accent: '#b45309',
  color_accent_dark: '#92400e',
  color_accent_light: '#d97706',
  color_text_primary: '#111827',
  color_text_secondary: '#6B7280',
  color_text_muted: '#9CA3AF',
  color_bg_primary: '#f0fdfa',
  color_bg_secondary: '#ffffff',
  color_bg_card: '#ffffff',
  theme_name: 'Iremia Default',
};

export const PRESET_THEMES = [
  {
    name: 'Iremia Teal (Default)',
    colors: {
      color_primary: '#1B7B7E',
      color_primary_dark: '#0D5456',
      color_primary_light: '#4FA5A8',
      color_primary_50: '#f0fdfa',
      color_primary_100: '#ccfbf1',
      color_accent: '#b45309',
      color_accent_dark: '#92400e',
      color_accent_light: '#d97706',
      color_text_primary: '#111827',
      color_text_secondary: '#6B7280',
      color_text_muted: '#9CA3AF',
      color_bg_primary: '#f0fdfa',
      color_bg_secondary: '#ffffff',
      color_bg_card: '#ffffff',
    },
  },
  {
    name: 'Bosco Verde',
    colors: {
      color_primary: '#2D6A4F',
      color_primary_dark: '#1B4332',
      color_primary_light: '#52B788',
      color_primary_50: '#f0fdf4',
      color_primary_100: '#dcfce7',
      color_accent: '#D4A017',
      color_accent_dark: '#A87800',
      color_accent_light: '#F0BF2C',
      color_text_primary: '#14532d',
      color_text_secondary: '#4B7C5A',
      color_text_muted: '#86EFAC',
      color_bg_primary: '#f0fdf4',
      color_bg_secondary: '#ffffff',
      color_bg_card: '#f9fafb',
    },
  },
  {
    name: 'Montagna Blu',
    colors: {
      color_primary: '#1E3A8A',
      color_primary_dark: '#1e2f6b',
      color_primary_light: '#3B82F6',
      color_primary_50: '#eff6ff',
      color_primary_100: '#dbeafe',
      color_accent: '#D97706',
      color_accent_dark: '#B45309',
      color_accent_light: '#F59E0B',
      color_text_primary: '#1e3a8a',
      color_text_secondary: '#475569',
      color_text_muted: '#94a3b8',
      color_bg_primary: '#f8fafc',
      color_bg_secondary: '#ffffff',
      color_bg_card: '#ffffff',
    },
  },
  {
    name: 'Terracotta Caldo',
    colors: {
      color_primary: '#9A3412',
      color_primary_dark: '#7C2D12',
      color_primary_light: '#EA580C',
      color_primary_50: '#fff7ed',
      color_primary_100: '#ffedd5',
      color_accent: '#854D0E',
      color_accent_dark: '#713F12',
      color_accent_light: '#CA8A04',
      color_text_primary: '#431407',
      color_text_secondary: '#78350f',
      color_text_muted: '#a16207',
      color_bg_primary: '#fff7ed',
      color_bg_secondary: '#fffbf5',
      color_bg_card: '#ffffff',
    },
  },
  {
    name: 'Lavanda Soft',
    colors: {
      color_primary: '#6D28D9',
      color_primary_dark: '#4C1D95',
      color_primary_light: '#8B5CF6',
      color_primary_50: '#f5f3ff',
      color_primary_100: '#ede9fe',
      color_accent: '#D97706',
      color_accent_dark: '#B45309',
      color_accent_light: '#F59E0B',
      color_text_primary: '#2e1065',
      color_text_secondary: '#5b21b6',
      color_text_muted: '#7c3aed',
      color_bg_primary: '#f5f3ff',
      color_bg_secondary: '#ffffff',
      color_bg_card: '#faf9ff',
    },
  },
];

export const themeService = {
  async getTheme() {
    const { data, error } = await supabase
      .from('theme_settings')
      .select('*')
      .maybeSingle();
    if (error && error.code !== 'PGRST116') return DEFAULT_THEME;
    return data || DEFAULT_THEME;
  },

  async updateTheme(id, themeData) {
    const { data, error } = await supabase
      .from('theme_settings')
      .update({ ...themeData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  applyTheme(theme) {
    const root = document.documentElement;
    const vars = {
      '--color-primary': theme.color_primary,
      '--color-primary-dark': theme.color_primary_dark,
      '--color-primary-light': theme.color_primary_light,
      '--color-primary-50': theme.color_primary_50,
      '--color-primary-100': theme.color_primary_100,
      '--color-accent': theme.color_accent,
      '--color-accent-dark': theme.color_accent_dark,
      '--color-accent-light': theme.color_accent_light,
      '--color-text-primary': theme.color_text_primary,
      '--color-text-secondary': theme.color_text_secondary,
      '--color-text-muted': theme.color_text_muted,
      '--color-bg-primary': theme.color_bg_primary,
      '--color-bg-secondary': theme.color_bg_secondary,
      '--color-bg-card': theme.color_bg_card,
    };
    Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));
  },
};
