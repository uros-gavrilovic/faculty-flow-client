export const SUPPORTED_LANGUAGES = ['en', 'sr'] as const;
export const DEFAULT_LANGUAGE: Language = 'en';
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
