import { NlpAdapter } from "src/nlp/types";
import { SupportedLanguage } from "src/nlp/languages";

const adapterRegistry = new Map<SupportedLanguage, () => NlpAdapter>();

export function registerAdapter(lang: SupportedLanguage, factory: () => NlpAdapter): void {
	if (adapterRegistry.has(lang)) {
		console.warn(`[nl-syntax-highlighting] Overwriting existing adapter for: ${lang}`);
	}
	adapterRegistry.set(lang, factory);
}

export function createAdapter(lang: string): NlpAdapter {
	const factory = adapterRegistry.get(lang as SupportedLanguage);
	if (!factory) {
		console.warn(`[nl-syntax-highlighting] No adapter for "${lang}", falling back to "en".`);
		const fallback = adapterRegistry.get("en");
		if (!fallback) {
			throw new Error("English adapter not registered. This is a bug.");
		}
		return fallback();
	}
	return factory();
}
