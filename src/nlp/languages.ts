export const SUPPORTED_LANGUAGES = [
	{ id: "en", label: "English" },
	{ id: "pt-br", label: "Portugu\u00eas (Brasil)" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["id"];

export function isValidLanguage(lang: string): lang is SupportedLanguage {
	return SUPPORTED_LANGUAGES.some(l => l.id === lang);
}
