import { describe, it, expect, vi } from "vitest";
import { createAdapter, registerAdapter } from "src/nlp/registry";
import { NlpAdapter } from "src/nlp/types";
import "src/nlp/english-adapter";
import "src/nlp/pt-br/portuguese-adapter";

describe("adapter registry", () => {
	it("creates an English adapter", () => {
		const adapter = createAdapter("en");
		expect(adapter).toBeDefined();
		expect(adapter.analyzeLine).toBeTypeOf("function");
	});

	it("creates a Portuguese adapter", () => {
		const adapter = createAdapter("pt-br");
		expect(adapter).toBeDefined();
		expect(adapter.analyzeLine).toBeTypeOf("function");
	});

	it("falls back to English for unknown language", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const adapter = createAdapter("unknown");
		expect(adapter).toBeDefined();
		expect(adapter.analyzeLine).toBeTypeOf("function");
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining("No adapter for")
		);
		warnSpy.mockRestore();
	});

	it("warns on re-registration", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const mockAdapter: NlpAdapter = {
			analyzeLine: () => [],
		};
		registerAdapter("en", () => mockAdapter);
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining("Overwriting existing adapter")
		);
		const adapter = createAdapter("en");
		expect(adapter).toBe(mockAdapter);
		warnSpy.mockRestore();

		// Restore the real adapter by re-importing
		// (side-effect imports already ran, so we re-register manually)
		import("src/nlp/english-adapter");
	});
});
