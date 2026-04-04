import { NlpAdapter, PosMatch } from "src/nlp/types";
import { registerAdapter } from "src/nlp/registry";
import { tokenizeLine } from "src/nlp/tokenizer";
import { PT_BR_STOP_WORDS } from "src/nlp/pt-br/stop-words";
import { PT_BR_LEXICON } from "src/nlp/pt-br/lexicon";
import { PT_BR_SUFFIX_RULES } from "src/nlp/pt-br/suffixes";

export class PortugueseAdapter implements NlpAdapter {
	analyzeLine(text: string): PosMatch[] {
		const normalized = text.normalize("NFC");
		const tokens = tokenizeLine(normalized);
		const matches: PosMatch[] = [];

		for (const token of tokens) {
			const result = this.classifyWord(token.word, token.start, token.end);
			if (result) {
				matches.push(result);
			}
		}

		return matches;
	}

	private classifyWord(word: string, start: number, end: number): PosMatch | null {
		// Handle clitics: split on first hyphen, analyze the left (verb) part
		const hyphenIndex = word.indexOf("-");
		const lookupWord = hyphenIndex > 0 ? word.slice(0, hyphenIndex) : word;
		const lower = lookupWord.toLowerCase();

		// 1. Stop words — skip
		if (PT_BR_STOP_WORDS.has(lower)) return null;

		// 2. Lexicon — highest priority
		const lexiconPos = PT_BR_LEXICON[lower];
		if (lexiconPos) {
			return { partOfSpeech: lexiconPos, start, end };
		}

		// 3. Suffix rules — fallback (longest suffix first, minimum 3-char stem)
		const MIN_STEM_LENGTH = 3;
		for (const rule of PT_BR_SUFFIX_RULES) {
			if (lower.length >= rule.suffix.length + MIN_STEM_LENGTH && lower.endsWith(rule.suffix)) {
				return { partOfSpeech: rule.partOfSpeech, start, end };
			}
		}

		// 4. No match — skip
		return null;
	}
}

registerAdapter("pt-br", () => new PortugueseAdapter());
