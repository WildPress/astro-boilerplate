export const ICON_NAMES = [
  'arrow-right',
  'badge-check',
  'chevron-down',
  'chevron-right',
  'external-link',
  'mail',
  'menu',
  'move-right',
  'search',
  'shield-check',
  'star',
  'x',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
