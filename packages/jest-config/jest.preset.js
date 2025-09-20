// packages/jest-config/jest.preset.js

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // Use the ts-jest preset for ESM support
    preset: "ts-jest/presets/default-esm",

    // A list of file extensions your modules use
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // The test environment that will be used for testing
    testEnvironment: "jsdom",

    // A map from regular expressions to module names or to arrays of module names
    // that allow to stub out resources with a single module.
    moduleNameMapper: {
        // This is the crucial part for handling ESM with ts-jest
        "^(\\.{1,2}/.*)\\.js$": "$1",

        // Handle monorepo package imports (@repo/*)
        "^@repo/(.*)$": "<rootDir>/../../packages/$1/src",

        // Mock CSS imports
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",

        // Mock static asset imports
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/../../packages/jest-config/file-mock.js",
    },

    // The transform config which tells jest how to process files
    transform: {
        // Use ts-jest for TypeScript and TSX files
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true, // Tell ts-jest to use ESM
                // Point to the correct tsconfig for your app
                tsconfig: "<rootDir>/tsconfig.app.json",
            },
        ],
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        "/node_modules/(?!@repo/)", // Transpile packages in the monorepo
    ],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
