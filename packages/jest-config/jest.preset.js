/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest/presets/default-esm",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
        "^@repo/([^/]+)$": "<rootDir>/../../packages/$1/src",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/../../packages/jest-config/file-mock.js",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,

                tsconfig: "<rootDir>/tsconfig.app.json",
            },
        ],
    },
    transformIgnorePatterns: ["/node_modules/(?!@repo/)"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
