/**
 * The transform matches `.ts`/`.tsx` only — never `.js` — so @swc/jest never
 * tries to recompile already-built output.
 *
 * Unit specs import the source relatively (`./index`), so there is no
 * self-referencing module mapper: mapping the package name to `src` while other
 * imports resolve to `dist` splits class identity and breaks DI.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true, dynamicImport: true },
          transform: { legacyDecorator: true, decoratorMetadata: true },
        },
      },
    ],
  },
  testEnvironment: "node",
  roots: ["<rootDir>/src/"],
  setupFiles: ["reflect-metadata"],
  setupFilesAfterEnv: ["jest-extended/all"],
}
