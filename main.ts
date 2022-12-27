import { Plugin } from 'obsidian';
import { NLSyntaxHighlightViewPlugin } from 'syntaxHighlight';
import { NLSyntaxHighlightPluginSettings, DEFAULT_SETTINGS, NLSyntaxHighlightSettingTab } from 'settings';


export default class NLSyntaxHighlightPlugin extends Plugin {
	settings: NLSyntaxHighlightPluginSettings;
	styleEl: Element;


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NLSyntaxHighlightSettingTab(this.app, this));

		this.registerEditorExtension(NLSyntaxHighlightViewPlugin.extension);

		this.styleEl = document.head.createEl("style");
		this.reloadStyle();
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

	convertSettingsToStyle(settings: NLSyntaxHighlightPluginSettings) {
		let style = "";

		const partsOfSpeech = ["adjective", "noun", "adverb", "verb", "conjunction"];
		const enabled = [settings.adjectiveEnabled, settings.nounEnabled, settings.adverbEnabled, settings.verbEnabled, settings.conjunctionEnabled];
		const colors = [settings.adjectiveColor, settings.nounColor, settings.adverbColor, settings.verbColor, settings.conjunctionColor];

		for (let i = 0; i < partsOfSpeech.length; i++) {
			if (enabled[i]) {
				style = style.concat(`.${partsOfSpeech[i]} { color: ${colors[i]} }\n`);
			}
		}

		return style;
	}

	reloadStyle() {
		this.styleEl.textContent = this.convertSettingsToStyle(this.settings);
	}
}