export interface SuffixRule {
	suffix: string;
	partOfSpeech: string;
}

// Ordered from longest to shortest suffix — first match wins
export const PT_BR_SUFFIX_RULES: ReadonlyArray<SuffixRule> = Object.freeze([
	// Adverbs — -mente covers the entire class; do not add -mente words to lexicon.ts
	{ suffix: "mente", partOfSpeech: "adverb" },

	// Nouns — long suffixes (high confidence)
	{ suffix: "ação", partOfSpeech: "noun" },
	{ suffix: "acao", partOfSpeech: "noun" },
	{ suffix: "ição", partOfSpeech: "noun" },
	{ suffix: "icao", partOfSpeech: "noun" },
	{ suffix: "ência", partOfSpeech: "noun" },
	{ suffix: "encia", partOfSpeech: "noun" },
	{ suffix: "ância", partOfSpeech: "noun" },
	{ suffix: "ancia", partOfSpeech: "noun" },
	{ suffix: "ncia", partOfSpeech: "noun" },
	{ suffix: "mento", partOfSpeech: "noun" },
	{ suffix: "dade", partOfSpeech: "noun" },
	{ suffix: "ismo", partOfSpeech: "noun" },
	{ suffix: "ista", partOfSpeech: "noun" },
	{ suffix: "agem", partOfSpeech: "noun" },
	{ suffix: "tura", partOfSpeech: "noun" },
	{ suffix: "ção", partOfSpeech: "noun" },
	{ suffix: "cao", partOfSpeech: "noun" },
	{ suffix: "ura", partOfSpeech: "noun" },

	// Verbs — gerunds (very reliable)
	{ suffix: "ando", partOfSpeech: "verb" },
	{ suffix: "endo", partOfSpeech: "verb" },
	{ suffix: "indo", partOfSpeech: "verb" },

	// Verbs — conjugated forms (medium-long suffixes)
	{ suffix: "aria", partOfSpeech: "verb" },
	{ suffix: "eria", partOfSpeech: "verb" },
	{ suffix: "iria", partOfSpeech: "verb" },
	{ suffix: "aram", partOfSpeech: "verb" },
	{ suffix: "eram", partOfSpeech: "verb" },
	{ suffix: "iram", partOfSpeech: "verb" },
	{ suffix: "amos", partOfSpeech: "verb" },
	{ suffix: "emos", partOfSpeech: "verb" },
	{ suffix: "imos", partOfSpeech: "verb" },
	{ suffix: "avam", partOfSpeech: "verb" },
	{ suffix: "iam", partOfSpeech: "verb" },
	{ suffix: "ava", partOfSpeech: "verb" },

	// Adjectives — long suffixes
	{ suffix: "ável", partOfSpeech: "adjective" },
	{ suffix: "avel", partOfSpeech: "adjective" },
	{ suffix: "ível", partOfSpeech: "adjective" },
	{ suffix: "ivel", partOfSpeech: "adjective" },
	{ suffix: "oso", partOfSpeech: "adjective" },
	{ suffix: "osa", partOfSpeech: "adjective" },
	{ suffix: "ivo", partOfSpeech: "adjective" },
	{ suffix: "iva", partOfSpeech: "adjective" },
	{ suffix: "ante", partOfSpeech: "adjective" },
	{ suffix: "ente", partOfSpeech: "adjective" },
	{ suffix: "vel", partOfSpeech: "adjective" },

	// Verbs — infinitives (short, lower priority)
	{ suffix: "ar", partOfSpeech: "verb" },
	{ suffix: "er", partOfSpeech: "verb" },
	{ suffix: "ir", partOfSpeech: "verb" },

	// Adjectives — past participle forms (lowest priority due to verb overlap)
	{ suffix: "ado", partOfSpeech: "adjective" },
	{ suffix: "ada", partOfSpeech: "adjective" },
	{ suffix: "ido", partOfSpeech: "adjective" },
	{ suffix: "ida", partOfSpeech: "adjective" },
	{ suffix: "al", partOfSpeech: "adjective" },
]);
