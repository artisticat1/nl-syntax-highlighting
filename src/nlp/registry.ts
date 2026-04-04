import { NlpAdapter, SupportedLanguage } from "src/nlp/types";

const adapterRegistry = new Map<SupportedLanguage, () => NlpAdapter>();

export function registerAdapter(lang: SupportedLanguage, factory: () => NlpAdapter): void {
	adapterRegistry.set(lang, factory);
}

export function createAdapter(lang: SupportedLanguage): NlpAdapter {
	const factory = adapterRegistry.get(lang);
	if (!factory) {
		throw new Error(`No NLP adapter registered for language: ${lang}`);
	}
	return factory();
}
