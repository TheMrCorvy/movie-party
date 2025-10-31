import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePoll from "./index";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { createPollSerice } from "../../services/pollService";
import { generateId } from "@repo/shared-utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("../../context/RoomContext/RoomContextProvider", () => ({
    useRoom: jest.fn(),
}));

jest.mock("../../services/pollService", () => ({
    createPollSerice: jest.fn(),
}));

jest.mock("@repo/shared-utils", () => ({
    generateId: jest.fn(),
}));

const mockUseRoom = useRoom as jest.Mock;
const mockCreatePollService = createPollSerice as jest.Mock;
const mockGenerateId = generateId as jest.Mock;

const theme = createTheme({ palette: { mode: "dark" } });

describe("CreatePoll Component", () => {
    beforeEach(() => {
        mockUseRoom.mockReturnValue({
            ws: {},
            room: {
                id: "room-123",
                myId: "peer-123",
                messages: [],
            },
        });
        mockGenerateId.mockReturnValue("mock-id");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the 'Iniciar encuesta' button", () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        expect(screen.getByText("Iniciar encuesta")).toBeInTheDocument();
    });

    it("should open the modal when 'Iniciar encuesta' is clicked", async () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText("Iniciar encuesta"));
        expect(await screen.findByText("Iniciar Encuesta")).toBeInTheDocument();
    });

    it("should allow typing in the title and option inputs", async () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText("Iniciar encuesta"));

        const titleInput = await screen.findByRole("textbox", {
            name: "Título para la encuesta",
        });
        const optionInput = await screen.findByRole("textbox", {
            name: "Opción",
        });

        fireEvent.change(titleInput, { target: { value: "New Poll Title" } });
        fireEvent.change(optionInput, { target: { value: "Option 1" } });

        expect(titleInput).toHaveValue("New Poll Title");
        expect(optionInput).toHaveValue("Option 1");
    });

    it("should add and remove poll options", async () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText("Iniciar encuesta"));

        const optionInput = await screen.findByRole("textbox", {
            name: "Opción",
        });
        const addButton = await screen.findByText("Agregar opción");

        fireEvent.change(optionInput, { target: { value: "Option 1" } });
        fireEvent.click(addButton);

        expect(await screen.findByText("Option 1")).toBeInTheDocument();

        const removeButton = await screen.findByLabelText("close");
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
        });
    });

    it("should create a poll and close the modal", async () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText("Iniciar encuesta"));

        const titleInput = await screen.findByRole("textbox", {
            name: "Título para la encuesta",
        });
        const optionInput = await screen.findByRole("textbox", {
            name: "Opción",
        });
        const addButton = await screen.findByText("Agregar opción");
        const createButton = await screen.findByText("Crear encuesta");

        fireEvent.change(titleInput, { target: { value: "Test Poll" } });

        fireEvent.change(optionInput, { target: { value: "Option A" } });
        fireEvent.click(addButton);
        fireEvent.change(optionInput, { target: { value: "Option B" } });
        fireEvent.click(addButton);

        fireEvent.click(createButton);

        expect(mockCreatePollService).toHaveBeenCalledWith({
            roomId: "room-123",
            peerId: "peer-123",
            ws: {},
            pollId: "mock-id",
            pollOptions: [
                {
                    title: "Option A",
                    value: "mock-id",
                    id: "mock-id",
                    votes: 0,
                },
                {
                    title: "Option B",
                    value: "mock-id",
                    id: "mock-id",
                    votes: 0,
                },
            ],
            title: "Test Poll",
        });

        await waitFor(() => {
            expect(
                screen.queryByText("Iniciar Encuesta")
            ).not.toBeInTheDocument();
        });
    });

    it("'Crear encuesta' button should be disabled if there are less than 2 options", async () => {
        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText("Iniciar encuesta"));

        const createButton = await screen.findByText("Crear encuesta");
        expect(createButton).toBeDisabled();

        const optionInput = await screen.findByRole("textbox", {
            name: "Opción",
        });
        const addButton = await screen.findByText("Agregar opción");

        fireEvent.change(optionInput, { target: { value: "Only one option" } });
        fireEvent.click(addButton);

        expect(createButton).toBeDisabled();
    });

    it("'Iniciar encuesta' button should be disabled if a poll is live", () => {
        mockUseRoom.mockReturnValue({
            ws: {},
            room: {
                id: "room-123",
                myId: "peer-123",
                messages: [
                    {
                        isPoll: true,
                        poll: { status: "live" },
                    },
                ],
            },
        });

        render(
            <ThemeProvider theme={theme}>
                <CreatePoll />
            </ThemeProvider>
        );
        const startPollButton = screen.getByText(
            "Ya hay una encuesta en proceso"
        );
        expect(startPollButton).toBeDisabled();
    });
});
