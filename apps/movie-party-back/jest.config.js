/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest/presets/default-esm",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "node",
    moduleNameMapper: {
        "^(\.{1,2}/.*)\\.js$": "$1",
        "^@repo/([^/]+)$": "<rootDir>/../../packages/$1/src",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "<rootDir>/tsconfig.json",
            },
        ],
    },
    transformIgnorePatterns: ["/node_modules/(?!@repo/)"],
};
