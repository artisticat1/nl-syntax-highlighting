import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import nlp from 'compromise';


import { EditorView, ViewUpdate, Decoration, DecorationSet, ViewPlugin } from "@codemirror/view";


interface NLSyntaxHighlightPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: NLSyntaxHighlightPluginSettings = {
	mySetting: 'default'
}

export default class NLSyntaxHighlightPlugin extends Plugin {
	settings: NLSyntaxHighlightPluginSettings;


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NLSyntaxHighlightSettingTab(this.app, this));

		this.registerEditorExtension(nlSyntaxHighlightViewPlugin.extension);
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


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


const nlSyntaxHighlightViewPlugin = ViewPlugin.fromClass(class {
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




class NLSyntaxHighlightSettingTab extends PluginSettingTab {
	plugin: NLSyntaxHighlightPlugin;

	constructor(app: App, plugin: NLSyntaxHighlightPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		// new Setting(containerEl)
		// 	.setName('Setting #1')
		// 	.setDesc('It\'s a secret')
		// 	.addText(text => text
		// 		.setPlaceholder('Enter your secret')
		// 		.setValue(this.plugin.settings.mySetting)
		// 		.onChange(async (value) => {
		// 			console.log('Secret: ' + value);
		// 			this.plugin.settings.mySetting = value;
		// 			await this.plugin.saveSettings();
		// 		}));
	}
}
