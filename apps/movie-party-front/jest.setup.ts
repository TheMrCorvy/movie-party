import "@testing-library/jest-dom";

// Add these lines to polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
