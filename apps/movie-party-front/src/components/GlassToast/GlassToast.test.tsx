import { render } from "@testing-library/react";
import { GlassToast } from "./index";
import {
    GlassToastProvider,
    useGlassToast,
} from "../../context/GlassToastContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect } from "react";

// Mock de MUI components
jest.mock("@mui/material", () => ({
    ...jest.requireActual("@mui/material"),
    Snackbar: ({
        children,
        open,
    }: {
        children: React.ReactNode;
        open: boolean;
    }) => (open ? <div data-testid="snackbar">{children}</div> : null),
}));

// Mock del componente GlassAlert para evitar problemas de animación
jest.mock("../GlassAlert", () => ({
    __esModule: true,
    default: ({
        title,
        variant,
        openFromProps,
    }: {
        title: string;
        variant: string;
        openFromProps: boolean;
    }) =>
        openFromProps && (
            <div role="alert" data-testid="glass-toast" data-variant={variant}>
                {title}
            </div>
        ),
}));

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

const renderWithProviders = (children: React.ReactNode) => {
    return render(
        <ThemeProvider theme={theme}>
            <GlassToastProvider>{children}</GlassToastProvider>
        </ThemeProvider>
    );
};

describe("GlassToast", () => {
    it("should render with the correct message and severity", async () => {
        const TestComponent = () => {
            const { dispatch } = useGlassToast();

            useEffect(() => {
                dispatch({
                    type: "SHOW_TOAST",
                    payload: { message: "Test message", severity: "success" },
                });
            }, [dispatch]);

            return <GlassToast />;
        };

        const { getByTestId } = renderWithProviders(<TestComponent />);

        const toast = getByTestId("glass-toast");
        expect(toast).toHaveTextContent("Test message");
        expect(toast.getAttribute("data-variant")).toBe("success");
    });
});
