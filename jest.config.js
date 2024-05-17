/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text-summary", "text", "html"],
  coverageDirectory: "coverage",
  //setupFiles: ["<rootDir>/test/tools/copy_json_bd_test.ts"],
};