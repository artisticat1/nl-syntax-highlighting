export interface PosMatch {
	partOfSpeech: string;
	start: number; // inclusive, character offset into the analyzed line
	end: number;   // exclusive, character offset into the analyzed line
}

export interface NlpAdapter {
	analyzeLine(text: string): PosMatch[];
}

export type SupportedLanguage = "en" | "pt-br";
