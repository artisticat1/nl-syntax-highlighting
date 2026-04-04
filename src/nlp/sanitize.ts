const CSS_CLASS_PATTERN = /[^a-zA-Z0-9_-]/g;
const CSS_HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$/;

export function sanitizeCssClassName(input: string): string {
	const sanitized = input.replace(CSS_CLASS_PATTERN, "");
	return sanitized;
}

export function sanitizeCssColorValue(input: string): string {
	if (CSS_HEX_COLOR_PATTERN.test(input)) return input;
	return "inherit";
}
