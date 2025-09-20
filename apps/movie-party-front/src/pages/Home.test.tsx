// src/pages/Home.test.tsx

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

// Mock the EnterRoom component to isolate the Home page test
jest.mock("../components/EnterRoom", () => ({
    __esModule: true,
    default: () => <div>Mocked EnterRoom Component</div>,
}));

describe("Home Page", () => {
    it("should render the EnterRoom component", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Check if the mocked component's text is in the document
        expect(
            screen.getByText("Mocked EnterRoom Component")
        ).toBeInTheDocument();
    });
});
