export interface Token {
	word: string;
	start: number;
	end: number;
}

const MARKDOWN_LEADING = /^(?:\*{1,2}|_{1,2}|~~|`|==|\[\[)+/;
const MARKDOWN_TRAILING = /(?:\*{1,2}|_{1,2}|~~|`|==|\]\])+$/;
const PUNCTUATION_LEADING = /^[.,:;!?()"'«»""\u2018\u2019]+/;
const PUNCTUATION_TRAILING = /[.,:;!?()"'«»""\u2018\u2019]+$/;

function strip(input: string): { word: string; leadingOffset: number } {
	let stripped = input;
	let leadingOffset = 0;
	let changed = true;

	// Iteratively strip markdown and punctuation until stable
	while (changed) {
		changed = false;

		const leadingMd = stripped.match(MARKDOWN_LEADING);
		if (leadingMd) {
			leadingOffset += leadingMd[0].length;
			stripped = stripped.slice(leadingMd[0].length);
			changed = true;
		}

		const trailingMd = stripped.match(MARKDOWN_TRAILING);
		if (trailingMd) {
			stripped = stripped.slice(0, -trailingMd[0].length);
			changed = true;
		}

		const leadingPunct = stripped.match(PUNCTUATION_LEADING);
		if (leadingPunct) {
			leadingOffset += leadingPunct[0].length;
			stripped = stripped.slice(leadingPunct[0].length);
			changed = true;
		}

		const trailingPunct = stripped.match(PUNCTUATION_TRAILING);
		if (trailingPunct) {
			stripped = stripped.slice(0, -trailingPunct[0].length);
			changed = true;
		}
	}

	return { word: stripped, leadingOffset };
}

export function tokenizeLine(text: string): Token[] {
	const tokens: Token[] = [];
	const regex = /\S+/g;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		const raw = match[0];
		const rawStart = match.index;

		const { word, leadingOffset } = strip(raw);

		if (word.length === 0) continue;

		tokens.push({
			word,
			start: rawStart + leadingOffset,
			end: rawStart + leadingOffset + word.length,
		});
	}

	return tokens;
}
