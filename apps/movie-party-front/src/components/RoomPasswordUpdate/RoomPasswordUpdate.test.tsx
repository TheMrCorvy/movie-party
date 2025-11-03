import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RoomPasswordUpdate from "./index";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({ palette: { mode: "dark" } });

global.fetch = jest.fn(
    () =>
        Promise.resolve({
            json: () => Promise.resolve({ roomHasPassword: true }),
        }) as Promise<Response>
);

describe("RoomPasswordUpdate Component", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it("should not render if the user is not the room owner", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RoomPasswordUpdate
                    imRoomOwner={false}
                    roomId="room-1"
                    peerId="peer-1"
                />
            </ThemeProvider>
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("should render the component if the user is the room owner", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomPasswordUpdate
                    imRoomOwner={true}
                    roomId="room-1"
                    peerId="peer-1"
                />
            </ThemeProvider>
        );
        expect(
            screen.getByLabelText("Contraseña de la sala")
        ).toBeInTheDocument();
    });

    it("should call fetch to update the password", async () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomPasswordUpdate
                    imRoomOwner={true}
                    roomId="room-1"
                    peerId="peer-1"
                    password="old-password"
                />
            </ThemeProvider>
        );

        const passwordInput = screen.getByLabelText("Contraseña de la sala");
        fireEvent.change(passwordInput, { target: { value: "new-password" } });

        const updateButton = screen.getByLabelText("update password");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:4000/room-password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        peerId: "peer-1",
                        roomId: "room-1",
                        password: "new-password",
                    }),
                }
            );
        });
    });

    it("should call fetch to remove the password", async () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomPasswordUpdate
                    imRoomOwner={true}
                    roomId="room-1"
                    peerId="peer-1"
                    password="old-password"
                />
            </ThemeProvider>
        );

        const removeButton = screen.getByLabelText("remove password");
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:4000/room-password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        peerId: "peer-1",
                        roomId: "room-1",
                        password: "",
                    }),
                }
            );
        });
    });

    it("should not render remove button if there is no password", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomPasswordUpdate
                    imRoomOwner={true}
                    roomId="room-1"
                    peerId="peer-1"
                />
            </ThemeProvider>
        );

        const removeButton = screen.queryByLabelText("remove password");
        expect(removeButton).not.toBeInTheDocument();
    });
});
