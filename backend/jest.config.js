/** @type {import("jest").Config} **/
export default {
  preset: "ts-jest/presets/default-esm",
  rootDir: "./",
  clearMocks: true,
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // Maps relative imports ending in .js back to their source .ts files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
};
