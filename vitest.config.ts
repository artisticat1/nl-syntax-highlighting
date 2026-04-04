import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"src": path.resolve(__dirname, "src"),
		},
	},
	test: {
		include: ["src/**/__tests__/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/**/__tests__/**"],
			reporter: ["text", "html"],
		},
	},
});
