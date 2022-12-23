import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";
import nlp from "compromise";
import CompromiseView from "compromise/types/view/one";


function getDecos(view: EditorView) {
	const widgets = [];

	for (const visibleRange of view.visibleRanges) {

		const docText = view.state.sliceDoc(visibleRange.from, visibleRange.to);

		const doc = nlp(docText);
        const wordsToHighlight: { [partOfSpeech: string]: CompromiseView }  = {};

        const adjectives = doc.adjectives();
		const nouns = doc.match("#Noun").not("#Pronoun").not("#Possessive");
        const adverbs = doc.adverbs();
        const verbs = doc.match("#Verb");
        const conjunctions = doc.conjunctions();

        wordsToHighlight["adjective"] = adjectives;
        wordsToHighlight["noun"] = nouns;
        wordsToHighlight["adverb"] = adverbs;
        wordsToHighlight["verb"] = verbs;
        wordsToHighlight["conjunction"] = conjunctions;


        for (const partOfSpeech of Object.keys(wordsToHighlight)) {
            const words = wordsToHighlight[partOfSpeech];
            // console.log(words);

            // Use .out("offset") to get the index of the word's start and end in the document
            for (const word of words.out("offset")) {

                const offset = word.offset;
                if (offset.length === 0) continue;
                const start = offset.start + visibleRange.from;

                // Use .terms[0].offset to ignore punctuation
                const end = start + word.terms[0].offset.length;

                widgets.push(Decoration.mark({
                    inclusive: true,
                    attributes: {},
                    class: partOfSpeech
                }).range(start, end));
            }
        }
	}

	return Decoration.set(widgets, true);
}


export const NLSyntaxHighlightViewPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = getDecos(view);
    }

    update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = getDecos(update.view);
		}
    }

}, { decorations: v => v.decorations, });
