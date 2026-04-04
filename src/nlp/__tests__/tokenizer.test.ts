import { describe, it, expect } from "vitest";
import { tokenizeLine } from "src/nlp/tokenizer";

describe("tokenizeLine", () => {
	it("tokenizes plain words with correct offsets", () => {
		const tokens = tokenizeLine("hello world");
		expect(tokens).toEqual([
			{ word: "hello", start: 0, end: 5 },
			{ word: "world", start: 6, end: 11 },
		]);
	});

	it("strips Markdown bold syntax", () => {
		const tokens = tokenizeLine("**bonito** dia");
		expect(tokens).toEqual([
			{ word: "bonito", start: 2, end: 8 },
			{ word: "dia", start: 11, end: 14 },
		]);
	});

	it("strips Markdown italic syntax", () => {
		const tokens = tokenizeLine("*bom* texto");
		expect(tokens).toEqual([
			{ word: "bom", start: 1, end: 4 },
			{ word: "texto", start: 6, end: 11 },
		]);
	});

	it("strips trailing punctuation", () => {
		const tokens = tokenizeLine("casa, bonita.");
		expect(tokens).toEqual([
			{ word: "casa", start: 0, end: 4 },
			{ word: "bonita", start: 6, end: 12 },
		]);
	});

	it("strips wikilink syntax", () => {
		const tokens = tokenizeLine("[[palavra]]");
		expect(tokens).toEqual([
			{ word: "palavra", start: 2, end: 9 },
		]);
	});

	it("strips highlight syntax", () => {
		const tokens = tokenizeLine("==destaque==");
		expect(tokens).toEqual([
			{ word: "destaque", start: 2, end: 10 },
		]);
	});

	it("handles mixed Markdown and punctuation", () => {
		const tokens = tokenizeLine("**ele** disse: _sim_.");
		expect(tokens[0]).toEqual({ word: "ele", start: 2, end: 5 });
		expect(tokens[1]).toEqual({ word: "disse", start: 8, end: 13 });
		expect(tokens[2]).toEqual({ word: "sim", start: 16, end: 19 });
	});

	it("returns empty array for empty input", () => {
		expect(tokenizeLine("")).toEqual([]);
	});

	it("returns empty array for whitespace-only input", () => {
		expect(tokenizeLine("   ")).toEqual([]);
	});

	it("handles multiple spaces between words", () => {
		const tokens = tokenizeLine("one   two");
		expect(tokens).toEqual([
			{ word: "one", start: 0, end: 3 },
			{ word: "two", start: 6, end: 9 },
		]);
	});

	it("skips tokens that reduce to empty after stripping", () => {
		const tokens = tokenizeLine("** !! hello");
		expect(tokens.some(t => t.word === "hello")).toBe(true);
		expect(tokens.every(t => t.word.length > 0)).toBe(true);
	});

	it("preserves hyphenated words as single tokens", () => {
		const tokens = tokenizeLine("guarda-chuva");
		expect(tokens).toEqual([
			{ word: "guarda-chuva", start: 0, end: 12 },
		]);
	});
});
