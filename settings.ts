import { App, PluginSettingTab, Setting } from 'obsidian';
import NLSyntaxHighlightPlugin from 'main';


export interface NLSyntaxHighlightPluginSettings {
	classToApplyHighlightingTo: string,
	adjectiveEnabled: boolean,
	adjectiveColor: string,
	nounEnabled: boolean,
	nounColor: string,
	adverbEnabled: boolean,
	adverbColor: string,
	verbEnabled: boolean,
	verbColor: string,
	conjunctionEnabled: boolean,
	conjunctionColor: string,
}

export const DEFAULT_SETTINGS: NLSyntaxHighlightPluginSettings = {
	classToApplyHighlightingTo: "",
	adjectiveEnabled: true,
	adjectiveColor: "#b97a0a",
	nounEnabled: true,
	nounColor: "#ce4924",
	adverbEnabled: true,
	adverbColor: "#c333a7",
	verbEnabled: true,
	verbColor: "#177eB8",
	conjunctionEnabled: true,
	conjunctionColor: "#01934e",
}


export class NLSyntaxHighlightSettingTab extends PluginSettingTab {
	plugin: NLSyntaxHighlightPlugin;

	constructor(app: App, plugin: NLSyntaxHighlightPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();



		const adjectives = new Setting(containerEl).setName("Adjectives");
		let adjectiveToggle:HTMLElement;

		adjectives.addToggle(toggle =>
			{
				adjectiveToggle = toggle.toggleEl;
				adjectiveToggle.parentElement?.parentElement?.prepend(adjectiveToggle);

				toggle.setValue(this.plugin.settings.adjectiveEnabled)
					.onChange(async (value) => {
						this.plugin.settings.adjectiveEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.reloadStyle();
					})
			}
		);

		adjectives.addColorPicker(component => component
			.setValue(this.plugin.settings.adjectiveColor)
			.onChange(async (value) => {
				this.plugin.settings.adjectiveColor = value;
				await this.plugin.saveSettings();
				this.plugin.reloadStyle();
		}));



		const nouns = new Setting(containerEl).setName("Nouns");
		let nounToggle:HTMLElement;

		nouns.addToggle(toggle =>
			{
				nounToggle = toggle.toggleEl;
				nounToggle.parentElement?.parentElement?.prepend(nounToggle);

				toggle.setValue(this.plugin.settings.nounEnabled)
					.onChange(async (value) => {
						this.plugin.settings.nounEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.reloadStyle();
					})
			}
		);

		nouns.addColorPicker(component => component
			.setValue(this.plugin.settings.nounColor)
			.onChange(async (value) => {
				this.plugin.settings.nounColor = value;
				await this.plugin.saveSettings();
				this.plugin.reloadStyle();
		}));



		const adverbs = new Setting(containerEl).setName("Adverbs");
		let adverbToggle:HTMLElement;

		adverbs.addToggle(toggle =>
			{
				adverbToggle = toggle.toggleEl;
				adverbToggle.parentElement?.parentElement?.prepend(adverbToggle);

				toggle.setValue(this.plugin.settings.adverbEnabled)
					.onChange(async (value) => {
						this.plugin.settings.adverbEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.reloadStyle();
					})
			}
		);

		adverbs.addColorPicker(component => component
			.setValue(this.plugin.settings.adverbColor)
			.onChange(async (value) => {
				this.plugin.settings.adverbColor = value;
				await this.plugin.saveSettings();
				this.plugin.reloadStyle();
		}));



		const verbs = new Setting(containerEl).setName("Verbs");
		let verbToggle:HTMLElement;

		verbs.addToggle(toggle =>
			{
				verbToggle = toggle.toggleEl;
				verbToggle.parentElement?.parentElement?.prepend(verbToggle);

				toggle.setValue(this.plugin.settings.verbEnabled)
					.onChange(async (value) => {
						this.plugin.settings.verbEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.reloadStyle();
					})
			}
		);

		verbs.addColorPicker(component => component
			.setValue(this.plugin.settings.verbColor)
			.onChange(async (value) => {
				this.plugin.settings.verbColor = value;
				await this.plugin.saveSettings();
				this.plugin.reloadStyle();
		}));



		const conjunctions = new Setting(containerEl).setName("Conjunctions");
		let conjunctionToggle:HTMLElement;

		conjunctions.addToggle(toggle =>
			{
				conjunctionToggle = toggle.toggleEl;
				conjunctionToggle.parentElement?.parentElement?.prepend(conjunctionToggle);

				toggle.setValue(this.plugin.settings.conjunctionEnabled)
					.onChange(async (value) => {
						this.plugin.settings.conjunctionEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.reloadStyle();
					})
			}
		);

		conjunctions.addColorPicker(component => component
			.setValue(this.plugin.settings.conjunctionColor)
			.onChange(async (value) => {
				this.plugin.settings.conjunctionColor = value;
				await this.plugin.saveSettings();
				this.plugin.reloadStyle();
			}));
			
			
			
			new Setting(containerEl)
			.setName('CSS class to apply syntax highlighting to')
			.setDesc('If specified, the syntax highlighting will only be applied to notes with the "cssclass" property in their YAML equal to the specified value.')
			.addText(text => text
				.setValue(this.plugin.settings.classToApplyHighlightingTo)
				.onChange(async (value) => {
					this.plugin.settings.classToApplyHighlightingTo = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
				}));

	}
}