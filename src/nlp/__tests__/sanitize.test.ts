import { describe, it, expect } from "vitest";
import { sanitizeCssClassName, sanitizeCssColorValue } from "src/nlp/sanitize";

describe("sanitizeCssClassName", () => {
	it("passes through valid class names", () => {
		expect(sanitizeCssClassName("my-class")).toBe("my-class");
		expect(sanitizeCssClassName("class_name")).toBe("class_name");
		expect(sanitizeCssClassName("ClassName123")).toBe("ClassName123");
	});

	it("strips invalid characters", () => {
		expect(sanitizeCssClassName("foo bar")).toBe("foobar");
		expect(sanitizeCssClassName("a.b")).toBe("ab");
	});

	it("strips CSS injection attempts", () => {
		expect(sanitizeCssClassName("} body { display: none } .x")).toBe("bodydisplaynonex");
		expect(sanitizeCssClassName("foo; color: red")).toBe("foocolorred");
	});

	it("returns empty string for empty input", () => {
		expect(sanitizeCssClassName("")).toBe("");
	});
});

describe("sanitizeCssColorValue", () => {
	it("passes through valid hex colors", () => {
		expect(sanitizeCssColorValue("#fff")).toBe("#fff");
		expect(sanitizeCssColorValue("#FF0000")).toBe("#FF0000");
		expect(sanitizeCssColorValue("#b97a0a")).toBe("#b97a0a");
		expect(sanitizeCssColorValue("#00000080")).toBe("#00000080");
	});

	it("rejects non-hex values", () => {
		expect(sanitizeCssColorValue("red")).toBe("inherit");
		expect(sanitizeCssColorValue("rgb(0,0,0)")).toBe("inherit");
		expect(sanitizeCssColorValue("")).toBe("inherit");
		expect(sanitizeCssColorValue("url(evil)")).toBe("inherit");
	});

	it("rejects colors without hash", () => {
		expect(sanitizeCssColorValue("b97a0a")).toBe("inherit");
	});
});
