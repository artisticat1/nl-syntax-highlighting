export interface PosMatch {
	partOfSpeech: string;
	start: number; // inclusive, character offset into the analyzed line
	end: number;   // exclusive, character offset into the analyzed line
}

export interface NlpAdapter {
	/** Analyze a single line of text. Caller guarantees NFC normalization. */
	analyzeLine(text: string): PosMatch[];
}

export type { SupportedLanguage } from "src/nlp/languages";
