import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeContext } from "../../context/ThemeContext/ThemeContext";
import ThemeSwitcher from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        containerStyles: {},
    })),
}));

const lightTheme = createTheme({ palette: { mode: "light" } });
const darkTheme = createTheme({ palette: { mode: "dark" } });

describe("ThemeSwitcher Component", () => {
    it("should render the dark mode icon (moon) when the theme is light", () => {
        const mockToggle = jest.fn();

        render(
            <ThemeContext.Provider value={{ toggleColorMode: mockToggle }}>
                <ThemeProvider theme={lightTheme}>
                    <ThemeSwitcher />
                </ThemeProvider>
            </ThemeContext.Provider>
        );

        expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument();
        expect(screen.queryByTestId("Brightness4Icon")).not.toBeInTheDocument();
    });

    it("should render the light mode icon (sun) when the theme is dark", () => {
        const mockToggle = jest.fn();

        render(
            <ThemeContext.Provider value={{ toggleColorMode: mockToggle }}>
                <ThemeProvider theme={darkTheme}>
                    <ThemeSwitcher />
                </ThemeProvider>
            </ThemeContext.Provider>
        );

        expect(screen.getByTestId("Brightness4Icon")).toBeInTheDocument();
        expect(screen.queryByTestId("Brightness7Icon")).not.toBeInTheDocument();
    });

    it("should call toggleColorMode from context when the button is clicked", () => {
        const mockToggle = jest.fn();

        render(
            <ThemeContext.Provider value={{ toggleColorMode: mockToggle }}>
                <ThemeProvider theme={darkTheme}>
                    <ThemeSwitcher />
                </ThemeProvider>
            </ThemeContext.Provider>
        );

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});
