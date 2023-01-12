import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";
import nlp from "compromise";
import CompromiseView from "compromise/types/view/one";
import NLSyntaxHighlightPlugin from "main";


export interface DecorationSpec {
    partOfSpeech: string,
    // Start and end are measured from the start of the *line* the decoration is on
    start: number,
    end: number
}


function getAllDecosByLine(view: EditorView) {

    const widgets:{[lineNumber: number]: DecorationSpec[]} = {};

    for (const visibleRange of view.visibleRanges) {
        const startLine = view.state.doc.lineAt(visibleRange.from).number;
        const endLine = view.state.doc.lineAt(visibleRange.to).number;

        for (let i = startLine; i <= endLine; i++) {
            widgets[i] = getDecosOnLine(view, i);
        }
    }

    return widgets;
}


function getDecosOnLine(view: EditorView, lineNumber: number) {
	const widgets = [];

    const line = view.state.doc.line(lineNumber);
    const docText = view.state.sliceDoc(line.from, line.to);

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

    // @ts-ignore
    const plugin:NLSyntaxHighlightPlugin = window.app.plugins.plugins['obsidian-nl-syntax-highlight'];


    for (const partOfSpeech of Object.keys(wordsToHighlight)) {
        const words = wordsToHighlight[partOfSpeech];
        // console.log(words);

        // Use .out("offset") to get the word's start and end indices in the document
        for (const word of words.out("offset")) {

            const offset = word.offset;
            const start = offset.start;

            // Use .terms[0].offset to ignore punctuation
            const end = start + word.terms[0].offset.length;

            if (start === end) continue;


            const truePartOfSpeech = (word.text in plugin.wordsToOverrideDict) ? plugin.wordsToOverrideDict[word.text] : partOfSpeech;

            widgets.push({partOfSpeech: truePartOfSpeech, start: start, end: end})
        }
    }

	return widgets;
}


function decosByLineToDecorationSet(view: EditorView, decorationsByLine: {[lineNumber: number]: DecorationSpec[]}) {

    const allWidgets = [];

    // Add lineStart to each of the decorations' positions
    // And return the resulting widgets

    for (const lineNumberStr of Object.keys(decorationsByLine)) {
        const lineNumber = parseInt(lineNumberStr);
        const widgets = decorationsByLine[lineNumber];
        const lineStart = view.state.doc.line(lineNumber).from;


        const offsetWidgets = widgets.map((decoSpec => {
            return Decoration.mark({
                    inclusive: true,
                    attributes: {},
                    class: decoSpec.partOfSpeech
            }).range(decoSpec.start + lineStart, decoSpec.end + lineStart);
        }));

        allWidgets.push(...offsetWidgets);
    }

    return Decoration.set(allWidgets, true);
}


export const NLSyntaxHighlightViewPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    decorationsByLine: {[lineNumber: number]: DecorationSpec[]};

    constructor(view: EditorView) {
        this.decorationsByLine = getAllDecosByLine(view);
        this.decorations = decosByLineToDecorationSet(view, this.decorationsByLine);
    }

    update(update: ViewUpdate) {
        let shouldRegenerateAllDecorations = false;

        if (update.docChanged) {
            // Performance:
            // When the user is typing, only re-generate decorations for the current line

            if (update.startState.doc.lines === update.state.doc.lines) {
                // Check whether the user is typing
                let changeCount = 0;
                let lineChangedNumber = 0;
                let singleCharacterInserted = true;

                update.changes.iterChangedRanges((fromA, toA, fromB, toB) => {
                    changeCount += 1;
                    if (changeCount > 1) singleCharacterInserted = false;

                    if (!((fromA === toA) && (toB === fromB + 1))) singleCharacterInserted = false;

                    lineChangedNumber = update.view.state.doc.lineAt(toB).number;
                })

                if (singleCharacterInserted) {
                    // Update decorations on the line the user is currently on
                    this.decorationsByLine[lineChangedNumber] = getDecosOnLine(update.view, lineChangedNumber);
                }
                else {
                    // A bigger change was made to the document -- re-generate all decorations
                    shouldRegenerateAllDecorations = true;
                }
            }
            else {
                // Lines were added or removed -- re-generate all decorations
                shouldRegenerateAllDecorations = true;
            }
		}
        else if (update.viewportChanged) {
            shouldRegenerateAllDecorations = true;
        }


        if (shouldRegenerateAllDecorations)
            this.decorationsByLine = getAllDecosByLine(update.view);


        this.decorations = decosByLineToDecorationSet(update.view, this.decorationsByLine);
    }

}, { decorations: v => v.decorations, });
