import { describe, it, expect } from "vitest";
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

	it("throws for unknown language", () => {
		expect(() => createAdapter("unknown" as any)).toThrow(
			"No NLP adapter registered for language: unknown"
		);
	});

	it("allows registering a custom adapter", () => {
		const mockAdapter: NlpAdapter = {
			analyzeLine: () => [],
		};
		registerAdapter("en", () => mockAdapter);
		const adapter = createAdapter("en");
		expect(adapter).toBe(mockAdapter);
	});
});
