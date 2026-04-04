import { Plugin } from 'obsidian';
import { NLSyntaxHighlightViewPlugin } from 'syntaxHighlight';
import { NLSyntaxHighlightPluginSettings, DEFAULT_SETTINGS, NLSyntaxHighlightSettingTab } from 'settings';
import { Extension } from '@codemirror/state';
import { NlpAdapter } from 'src/nlp/types';
import { createAdapter } from 'src/nlp/registry';
import { isValidLanguage } from 'src/nlp/languages';
import { sanitizeCssClassName, sanitizeCssColorValue } from 'src/nlp/sanitize';
import 'src/nlp/english-adapter';
import 'src/nlp/pt-br/portuguese-adapter';


export default class NLSyntaxHighlightPlugin extends Plugin {
	settings: NLSyntaxHighlightPluginSettings;
	extensions: Extension[];
	wordsToOverrideDict: {[word: string]: string};
	styleEl: Element;
	nlpAdapter: NlpAdapter;


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NLSyntaxHighlightSettingTab(this.app, this));

		this.loadWordsToOverrideDict();
		this.nlpAdapter = createAdapter(this.settings.language ?? "en");

		this.extensions = this.settings.enabled ? [NLSyntaxHighlightViewPlugin.extension] : [];
		this.registerEditorExtension(this.extensions);
		
		this.styleEl = document.head.createEl("style");
		this.reloadStyle();

		this.addCommands();
	}

	onunload() {
		this.styleEl.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		if (!isValidLanguage(this.settings.language)) {
			this.settings.language = DEFAULT_SETTINGS.language;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addCommands() {
		this.addCommand({
			id: "toggle-enabled",
			name: "Toggle on/off",
			callback: async () => {
				this.settings.enabled = !this.settings.enabled;
				await this.saveSettings();
				this.updateExtensionEnabled(this.settings.enabled);
			}
		})
	}

	updateExtensionEnabled(enabled: boolean) {
		this.extensions.length = 0;
		if (enabled) {
			this.extensions.push(NLSyntaxHighlightViewPlugin.extension);
		}
		this.app.workspace.updateOptions();
	}

	convertSettingsToStyle(settings: NLSyntaxHighlightPluginSettings) {
		let style = "";

		const partsOfSpeech = ["adjective", "noun", "adverb", "verb", "conjunction"];
		const enabled = [settings.adjectiveEnabled, settings.nounEnabled, settings.adverbEnabled, settings.verbEnabled, settings.conjunctionEnabled];
		const colors = [settings.adjectiveColor, settings.nounColor, settings.adverbColor, settings.verbColor, settings.conjunctionColor];
		const safeClass = sanitizeCssClassName(settings.classToApplyHighlightingTo);

		for (let i = 0; i < partsOfSpeech.length; i++) {
			if (enabled[i]) {
				const safeColor = sanitizeCssColorValue(colors[i]);
				if (safeClass.length > 0) {
					style = style.concat(`.${safeClass} .${partsOfSpeech[i]} { color: ${safeColor} }\n`);
				}
				else {
					style = style.concat(`.${partsOfSpeech[i]} { color: ${safeColor} }\n`);
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
		this.updateExtensionEnabled(this.settings.enabled);
	}
}
