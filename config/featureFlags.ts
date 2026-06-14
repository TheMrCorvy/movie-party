import "@salvatore.hakase/log-data";
import { FeatureNames } from "@salvatore.hakase/log-data";

export const FeatureFlagsAvailable = {
    ...FeatureNames,
} as const;

export type FeatureFlagsAvailable =
    (typeof FeatureFlagsAvailable)[keyof typeof FeatureFlagsAvailable];
