import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";
import { PosMatch } from "src/nlp/types";
import NLSyntaxHighlightPlugin from "main";


function getAllDecosByLine(view: EditorView) {

    const widgets:{[lineNumber: number]: PosMatch[]} = {};

    for (const visibleRange of view.visibleRanges) {
        const startLine = view.state.doc.lineAt(visibleRange.from).number;
        const endLine = view.state.doc.lineAt(visibleRange.to).number;

        for (let i = startLine; i <= endLine; i++) {
            widgets[i] = getDecosOnLine(view, i);
        }
    }

    return widgets;
}


function getDecosOnLine(view: EditorView, lineNumber: number): PosMatch[] {
    // @ts-ignore
    const plugin:NLSyntaxHighlightPlugin = window.app.plugins.plugins['nl-syntax-highlighting'];

    if (!plugin?.nlpAdapter) return [];

    const line = view.state.doc.line(lineNumber);
    const docText = view.state.sliceDoc(line.from, line.to);
    const normalizedText = docText.normalize("NFC");

    const matches = plugin.nlpAdapter.analyzeLine(normalizedText);

    return matches.map(match => {
        const wordText = normalizedText.slice(match.start, match.end);
        const overridden = (wordText in plugin.wordsToOverrideDict)
            ? plugin.wordsToOverrideDict[wordText]
            : match.partOfSpeech;

        return { partOfSpeech: overridden, start: match.start, end: match.end };
    });
}


function decosByLineToDecorationSet(view: EditorView, decorationsByLine: {[lineNumber: number]: PosMatch[]}) {

    const allWidgets = [];

    for (const lineNumberStr of Object.keys(decorationsByLine)) {
        const lineNumber = parseInt(lineNumberStr);
        const widgets = decorationsByLine[lineNumber];
        const lineStart = view.state.doc.line(lineNumber).from;

        const offsetWidgets = widgets.map((match => {
            return Decoration.mark({
                    inclusive: true,
                    attributes: {},
                    class: match.partOfSpeech
            }).range(match.start + lineStart, match.end + lineStart);
        }));

        allWidgets.push(...offsetWidgets);
    }

    return Decoration.set(allWidgets, true);
}


export const NLSyntaxHighlightViewPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    decorationsByLine: {[lineNumber: number]: PosMatch[]};

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
                    this.decorationsByLine[lineChangedNumber] = getDecosOnLine(update.view, lineChangedNumber);
                }
                else {
                    shouldRegenerateAllDecorations = true;
                }
            }
            else {
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
