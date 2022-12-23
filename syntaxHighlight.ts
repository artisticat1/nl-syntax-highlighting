import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";
import nlp from 'compromise';


function getDecos(view: EditorView) {
	const widgets = [];

	for (const visibleRange of view.visibleRanges) {

		const docText = view.state.sliceDoc(visibleRange.from, visibleRange.to);

		const doc = nlp(docText);
		const nouns = doc.match("#Noun").not("#Pronoun").not("#Possessive");
		console.log(nouns.out("offset"));

		for (const noun of nouns.out("offset")) {
			const offset = noun.offset;
			const start = offset.start + visibleRange.from;
			const end = start + offset.length;

			widgets.push(Decoration.mark({
				inclusive: true,
				attributes: {},
				class: "noun"
			}).range(start, end));
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
		if (update.docChanged) {
			this.decorations = getDecos(update.view);
		}
    }

}, { decorations: v => v.decorations, });
