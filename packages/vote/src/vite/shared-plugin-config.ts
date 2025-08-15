import presetIcons from '@unocss/preset-icons';
import { presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';

export const sharedPluginsConfig = [
  UnoCSS({
    mode: 'shadow-dom',
    presets: [presetUno(), presetIcons()],
    shortcuts: {
      // Text
      'text-title': 'text-[var(--vote-text-title-color,#18181b)]',
      'text-description': 'text-[var(--vote-text-description-color,#71717a)]',
      'text-selected': 'text-[var(--vote-text-selected-color,#f0444475)]',
      'text-voted': 'text-[var(--vote-text-voted-color,#1d4ed8)]',
      'text-error': 'text-[var(--vote-text-error-color,#ef4444)]',
      'text-button': 'text-[var(--vote-text-button-color,#ffffff)]',
      'text-icon': 'text-[var(--vote-icon-color,#71717a)]',
      // Background
      'bg-primary': 'bg-[var(--vote-background-primary-color,#ffffff)]',
      'bg-secondary': 'bg-[var(--vote-background-secondary-color,#f9fafb)]',
      'bg-tertiary': 'bg-[var(--vote-background-tertiary-color,#f3f4f6)]',
      'bg-selected': 'bg-[var(--vote-background-selected-color,#f0444475)]',
      'bg-voted': 'bg-[var(--vote-background-voted-color,#eff6ff)]',
      'bg-progress': 'bg-[var(--vote-background-progress-color,rgba(229,231,235,0.6))]',
      'bg-progress-voted': 'bg-[var(--vote-background-progress-voted-color,rgba(191,219,254,0.4))]',
      'bg-button': 'bg-[var(--vote-background-button-color,#3b82f6)]',
      'bg-button-hover': 'hover:bg-[var(--vote-background-button-hover-color,#2563eb)]',
      'bg-tag': 'bg-[var(--vote-background-tag-color,#f3f4f6)]',
      'bg-voted-tag': 'bg-[var(--vote-background-voted-tag-color,#dbeafe)]',
      // Border
      'border-default': 'border-[var(--vote-border-color,#e5e7eb)]',
      'border-selected': 'border-[var(--vote-border-selected-color,#c628287a)]',
      'border-voted': 'border-[var(--vote-border-voted-color,#60a5fa)]',

      // PK Progress Bar
      'pk-option1-bg': 'bg-[var(--vote-pk-option1-bg,#3b82f6)]',
      'pk-option2-bg': 'bg-[var(--vote-pk-option2-bg,#f97316)]',
      'pk-progress-text': 'text-[var(--vote-pk-progress-text-color,#ffffff)]',
    },
  }),
];
