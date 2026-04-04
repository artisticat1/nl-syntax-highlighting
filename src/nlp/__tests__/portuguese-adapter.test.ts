import { describe, it, expect } from "vitest";
import { PortugueseAdapter } from "src/nlp/pt-br/portuguese-adapter";

describe("PortugueseAdapter", () => {
	const adapter = new PortugueseAdapter();

	it("classifies nouns from lexicon", () => {
		const matches = adapter.analyzeLine("casa");
		expect(matches).toEqual([
			{ partOfSpeech: "noun", start: 0, end: 4 },
		]);
	});

	it("classifies adjectives from lexicon", () => {
		const matches = adapter.analyzeLine("bonito");
		expect(matches).toEqual([
			{ partOfSpeech: "adjective", start: 0, end: 6 },
		]);
	});

	it("classifies verbs from lexicon", () => {
		const matches = adapter.analyzeLine("correu");
		expect(matches).toEqual([
			{ partOfSpeech: "verb", start: 0, end: 6 },
		]);
	});

	it("classifies conjunctions from lexicon", () => {
		const matches = adapter.analyzeLine("porque");
		expect(matches).toEqual([
			{ partOfSpeech: "conjunction", start: 0, end: 6 },
		]);
	});

	it("classifies adverbs ending in -mente via suffix rules", () => {
		const matches = adapter.analyzeLine("rapidamente");
		expect(matches).toEqual([
			{ partOfSpeech: "adverb", start: 0, end: 11 },
		]);
	});

	it("skips stop words", () => {
		const matches = adapter.analyzeLine("do da no na");
		expect(matches).toEqual([]);
	});

	it("skips pronouns and articles", () => {
		const matches = adapter.analyzeLine("eu ele ela os as");
		expect(matches).toEqual([]);
	});

	it("lexicon takes priority over suffix rules", () => {
		// "estado" is in lexicon as noun, even though -ado could be adjective via suffix
		const matches = adapter.analyzeLine("estado");
		expect(matches).toEqual([
			{ partOfSpeech: "noun", start: 0, end: 6 },
		]);
	});

	it("uses suffix fallback for unknown words ending in -ção", () => {
		// A fabricated word ending in -cao that's not in lexicon
		const matches = adapter.analyzeLine("xablicação");
		expect(matches.length).toBe(1);
		expect(matches[0].partOfSpeech).toBe("noun");
	});

	it("handles clitic pronouns with hyphens", () => {
		// "vê" is in lexicon as verb
		const matches = adapter.analyzeLine("vê-lo");
		expect(matches).toEqual([
			{ partOfSpeech: "verb", start: 0, end: 5 },
		]);
	});

	it("works with NFC-normalized accented characters (per interface contract)", () => {
		// Caller is responsible for NFC normalization. Adapter receives NFC text.
		// "bonito" is in lexicon — accented words like "situação" are also in lexicon
		const matches = adapter.analyzeLine("situa\u00E7\u00E3o"); // situação (NFC)
		expect(matches.length).toBe(1);
		expect(matches[0].partOfSpeech).toBe("noun");
	});

	it("classifies 'se' as conjunction (not filtered as stop word)", () => {
		const matches = adapter.analyzeLine("se");
		expect(matches).toEqual([
			{ partOfSpeech: "conjunction", start: 0, end: 2 },
		]);
	});

	it("analyzes a full Portuguese sentence", () => {
		const matches = adapter.analyzeLine("O gato bonito correu rapidamente");
		const pos = matches.map(m => m.partOfSpeech);
		// "O" = stop word (article), "gato" = noun, "bonito" = adjective,
		// "correu" = verb, "rapidamente" = adverb (suffix -mente)
		expect(pos).toContain("noun");
		expect(pos).toContain("adjective");
		expect(pos).toContain("verb");
		expect(pos).toContain("adverb");
	});

	it("returns empty array for empty input", () => {
		expect(adapter.analyzeLine("")).toEqual([]);
	});

	it("skips unknown words with no suffix match", () => {
		const matches = adapter.analyzeLine("xyz");
		expect(matches).toEqual([]);
	});

	it("handles words with Markdown syntax", () => {
		const matches = adapter.analyzeLine("**bonito**");
		expect(matches.length).toBe(1);
		expect(matches[0].partOfSpeech).toBe("adjective");
	});

	it("classifies conjunctions in a sentence", () => {
		const matches = adapter.analyzeLine("inteligente mas preguiçoso");
		const conjunctions = matches.filter(m => m.partOfSpeech === "conjunction");
		expect(conjunctions.length).toBe(1);
	});
});
