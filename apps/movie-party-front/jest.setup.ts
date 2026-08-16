import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";
import { hgts } from "@salvatore.hakase/hgts";
import { resources } from "./src/lib/HGTS";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

hgts.setup({
    resources,
    defaultLocale: "es",
    fallbackLocale: "en",
});
