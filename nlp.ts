import enNlp from "compromise";
import deNlp from "de-compromise";

export type NlpLanguage = "en" | "de";

export interface PosSpan {
	partOfSpeech: string;
	start: number;
	end: number;
}

interface TermJson {
	pre: string;
	text: string;
	post: string;
	tags: string[];
}

interface DocLike {
	json(): { terms: TermJson[] }[];
}

type NlpFn = (text: string) => DocLike;

const nlpInstances: Partial<Record<NlpLanguage, NlpFn>> = {};

export function getNlp(language: NlpLanguage): NlpFn {
	let nlp = nlpInstances[language];
	if (!nlp) {
		nlp = (language === "de" ? deNlp : enNlp) as unknown as NlpFn;
		nlpInstances[language] = nlp;
	}
	return nlp;
}

function categoryForTags(tags: string[]): string | null {
	const has = (tag: string) => tags.indexOf(tag) !== -1;
	if (has("Adjective")) return "adjective";
	if (has("Noun") && !has("Pronoun") && !has("Possessive") && !has("Determiner")) return "noun";
	if (has("Adverb")) return "adverb";
	if (has("Verb")) return "verb";
	if (has("Conjunction")) return "conjunction";
	return null;
}

export function getPosSpans(text: string, language: NlpLanguage): PosSpan[] {
	const doc = getNlp(language)(text);
	const spans: PosSpan[] = [];
	let offset = 0;
	for (const sentence of doc.json()) {
		for (const term of sentence.terms) {
			const start = offset + term.pre.length;
			const end = start + term.text.length;
			offset = end + term.post.length;
			const category = categoryForTags(term.tags);
			if (category !== null && end > start) {
				spans.push({ partOfSpeech: category, start, end });
			}
		}
	}
	return spans;
}
