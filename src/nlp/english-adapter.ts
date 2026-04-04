import nlp from "compromise";
import CompromiseView from "compromise/types/view/one";
import { NlpAdapter, PosMatch } from "src/nlp/types";
import { registerAdapter } from "src/nlp/registry";

export class EnglishAdapter implements NlpAdapter {
	analyzeLine(text: string): PosMatch[] {
		const matches: PosMatch[] = [];
		const doc = nlp(text);

		const wordsToHighlight: { [partOfSpeech: string]: CompromiseView } = {};
		wordsToHighlight["adjective"] = doc.adjectives();
		wordsToHighlight["noun"] = doc.match("#Noun").not("#Pronoun").not("#Possessive");
		wordsToHighlight["adverb"] = doc.adverbs();
		wordsToHighlight["verb"] = doc.match("#Verb");
		wordsToHighlight["conjunction"] = doc.conjunctions();

		for (const partOfSpeech of Object.keys(wordsToHighlight)) {
			const words = wordsToHighlight[partOfSpeech];

			for (const word of words.out("offset")) {
				const offset = word.offset;
				const start = offset.start;
				const end = start + word.terms[0].offset.length;

				if (start === end) continue;

				matches.push({ partOfSpeech, start, end });
			}
		}

		return matches;
	}
}

registerAdapter("en", () => new EnglishAdapter());
