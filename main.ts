import { Plugin } from 'obsidian';
import { NLSyntaxHighlightViewPlugin } from 'syntaxHighlight';
import { NLSyntaxHighlightPluginSettings, DEFAULT_SETTINGS, NLSyntaxHighlightSettingTab } from 'settings';
import { Extension } from '@codemirror/state';


export default class NLSyntaxHighlightPlugin extends Plugin {
	settings: NLSyntaxHighlightPluginSettings;
	extensions: Extension[];
	wordsToOverrideDict: {[word: string]: string};
	styleEl: Element;


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NLSyntaxHighlightSettingTab(this.app, this));

		this.loadWordsToOverrideDict();

		this.extensions = [NLSyntaxHighlightViewPlugin.extension];
		this.registerEditorExtension(this.extensions);

		this.styleEl = document.head.createEl("style");
		this.reloadStyle();

		await this.addCommands();
	}

	onunload() {
		this.styleEl.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async addCommands() {
		this.addCommand({
			id: "toggle-active",
			name: "Toggle natural language highlighting",
			callback: () => {
				this.settings.active = !this.settings.active;
				this.saveSettings();
				this.reloadStyle();
			}
		})
	}

	convertSettingsToStyle(settings: NLSyntaxHighlightPluginSettings) {
		let style = "";

		const partsOfSpeech = ["adjective", "noun", "adverb", "verb", "conjunction"];
		const enabled = [settings.adjectiveEnabled, settings.nounEnabled, settings.adverbEnabled, settings.verbEnabled, settings.conjunctionEnabled];
		const colors = [settings.adjectiveColor, settings.nounColor, settings.adverbColor, settings.verbColor, settings.conjunctionColor];

		for (let i = 0; i < partsOfSpeech.length; i++) {
			if (enabled[i] && settings.active) {
				if (settings.classToApplyHighlightingTo.length > 0) {
					style = style.concat(`.${settings.classToApplyHighlightingTo} .${partsOfSpeech[i]} { color: ${colors[i]} }\n`);
				}
				else {
					style = style.concat(`.${partsOfSpeech[i]} { color: ${colors[i]} }\n`);
				}
			}
		}

		return style;
	}

	reloadStyle() {
		this.styleEl.textContent = this.convertSettingsToStyle(this.settings);
	}

	loadWordsToOverrideDict() {
		const dict: {[word: string]: string} = {};

		const lines = this.settings.wordsToOverride.split("\n");
		lines.forEach(val => {
			const line = val.replaceAll(" ", "").split(":");

			if (line[1])
				dict[line[0]] = line[1];
		});

		this.wordsToOverrideDict = dict;
	}

	reloadEditorExtensions() {
		this.extensions.pop();
		this.app.workspace.updateOptions();
		this.extensions.push(NLSyntaxHighlightViewPlugin.extension);
		this.app.workspace.updateOptions();
	}
}