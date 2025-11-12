import { render, screen, fireEvent } from "@testing-library/react";
import GlassDrawer from ".";
import {
    GlassDrawerProvider,
    useGlassDrawer,
} from "../../context/GlassDrawerContext";
import { FC, useEffect } from "react";

const TestComponent: FC = () => {
    const { dispatch } = useGlassDrawer();

    useEffect(() => {
        dispatch({
            type: "OPEN_DRAWER",
            payload: {
                anchor: "left",
                children: <div>Test Content</div>,
            },
        });
    }, [dispatch]);

    return null;
};

describe("GlassDrawer", () => {
    it("should not be visible when open is false", () => {
        render(
            <GlassDrawerProvider>
                <GlassDrawer />
            </GlassDrawerProvider>
        );

        expect(screen.queryByRole("drawer")).not.toBeInTheDocument();
    });

    it("should be visible when open is true", () => {
        render(
            <GlassDrawerProvider>
                <TestComponent />
                <GlassDrawer />
            </GlassDrawerProvider>
        );

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should close when onClose is called", () => {
        render(
            <GlassDrawerProvider>
                <TestComponent />
                <GlassDrawer />
            </GlassDrawerProvider>
        );

        const drawer = screen.getByRole("presentation");

        // The drawer is opened by TestComponent. Now we simulate a close.
        // In MUI's SwipeableDrawer, closing can be triggered by various events.
        // One of them is clicking the backdrop.
        const backdrop =
            drawer.parentElement?.querySelector(".MuiBackdrop-root");

        if (backdrop) {
            fireEvent.click(backdrop);
        }

        // After the click, the drawer should be closed.
        // We can't directly test the state, but we can test that the content is gone.
        expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
    });
});
