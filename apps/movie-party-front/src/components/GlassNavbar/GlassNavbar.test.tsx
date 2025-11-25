import { render, screen } from "@testing-library/react";
import GlassNavbar from ".";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FC, ReactNode } from "react";

// Mock ThemeProvider to wrap components
const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
    const theme = createTheme();
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe("GlassNavbar", () => {
    it("should render the children", () => {
        render(
            <GlassNavbar>
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        expect(screen.getByText("child")).toBeInTheDocument();
    });

    it("should apply the correct styles for top location", () => {
        const { container } = render(
            <GlassNavbar location="top">
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        const appBar = container.querySelector(".MuiAppBar-root");
        expect(appBar).toHaveStyle("top: 0");
        expect(appBar).toHaveStyle("bottom: auto");
    });

    it("should apply the correct styles for bottom location", () => {
        const { container } = render(
            <GlassNavbar location="bottom">
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        const appBar = container.querySelector(".MuiAppBar-root");
        expect(appBar).toHaveStyle("top: auto");
        expect(appBar).toHaveStyle("bottom: 0");
    });

    it("should apply padding when padding is a number", () => {
        const { container } = render(
            <GlassNavbar padding={2}>
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        const appBar = container.querySelector(".MuiAppBar-root");
        expect(appBar).toHaveStyle("padding: 16px");
    });

    it("should apply padding when padding is a string", () => {
        const { container } = render(
            <GlassNavbar padding="2rem">
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        const appBar = container.querySelector(".MuiAppBar-root");
        expect(appBar).toHaveStyle("padding: 2rem");
    });

    it("should apply padding when padding is an object", () => {
        const { container } = render(
            <GlassNavbar
                padding={{ paddingTop: "1rem", paddingBottom: "1rem" }}
            >
                <div>child</div>
            </GlassNavbar>,
            { wrapper: AllTheProviders }
        );
        const appBar = container.querySelector(".MuiAppBar-root");
        expect(appBar).toHaveStyle("padding-top: 1rem");
        expect(appBar).toHaveStyle("padding-bottom: 1rem");
    });
});
