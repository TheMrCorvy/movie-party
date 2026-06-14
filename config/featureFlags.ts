import "@salvatore.hakase/log-data";
import { FeatureNames } from "@salvatore.hakase/log-data";

export const FeatureFlagsAvailable = {
    ...FeatureNames,
    CONSOLE_LOG_ALL_LAYERS: "CONSOLE_LOG_ALL_LAYERS",
    CONSOLE_LOG_LAYER_SPECIFIC: "CONSOLE_LOG_LAYER_SPECIFIC",
    ACCESS_MICROPHONE: "ACCESS_MICROPHONE",
    PLAY_SOUNDS: "PLAY_SOUNDS",
} as const;

export type FeatureFlagsAvailable =
    (typeof FeatureFlagsAvailable)[keyof typeof FeatureFlagsAvailable];
