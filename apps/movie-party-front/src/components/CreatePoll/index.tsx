import { Grid, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState, type FC } from "react";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import GlassModal, { ModalAction } from "../GlassModal";
import GlassAlert, { AlertCallbackParams } from "../GlassAlert";
import { generateId } from "@repo/shared-utils";
import { PollOption } from "@repo/type-definitions";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { createPollSerice } from "../../services/pollService";

const CreatePoll: FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [titleVal, setTitleVal] = useState("");
    const [options, setOptions] = useState<PollOption[]>([]);
    const [disabledBtn, setDisabledBtn] = useState(false);

    const { ws, room } = useRoom();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        target: "title" | "option"
    ) => {
        e.preventDefault();
        if (target === "option") {
            setInputVal(e.target.value);
        } else {
            setTitleVal(e.target.value);
        }
    };

    const addOption = () => {
        const isAlreadyAdded = options.find((opt) => opt.title === inputVal);

        if (isAlreadyAdded) {
            return;
        }

        const idValue = generateId();
        setOptions([
            ...options,
            {
                title: inputVal,
                value: idValue,
                id: idValue,
                votes: 0,
            },
        ]);

        setInputVal("");
    };

    const modalActions: ModalAction[] = [
        {
            callback: () => closeModal(),
            buttonLabel: "Cancelar",
        },
        {
            callback: () => emitPollCreation(),
            buttonLabel: "Crear encuesta",
            buttonProps: {
                disabled: options.length < 2 || options.length > 6,
            },
        },
    ];

    const removeOption = (param: AlertCallbackParams) => {
        const newArr = options.filter((opt) => opt.id !== param.id);
        setOptions(newArr);
    };

    const closeModal = () => {
        setInputVal("");
        setTitleVal("");
        setOptions([]);
        setModalOpen(false);
    };

    const emitPollCreation = () => {
        createPollSerice({
            roomId: room.id,
            peerId: room.myId,
            ws,
            pollId: generateId(),
            pollOptions: options,
            title: titleVal,
        });

        closeModal();
    };

    useEffect(() => {
        let shouldBeDisabled = false;

        room.messages.map((message) => {
            if (
                message.isPoll &&
                message.poll &&
                message.poll.status === "live" &&
                !shouldBeDisabled
            ) {
                shouldBeDisabled = true;
            }
        });

        setDisabledBtn(shouldBeDisabled);
    }, [room.messages]);

    return (
        <>
            <GlassButton
                disabled={disabledBtn}
                onClick={() => setModalOpen(true)}
            >
                {disabledBtn
                    ? "Ya hay una encuesta en proceso"
                    : "Iniciar encuesta"}
            </GlassButton>
            <GlassModal
                open={modalOpen}
                closeModalWithoutCallback={closeModal}
                modalActions={modalActions}
                title="Iniciar Encuesta"
            >
                <Grid
                    container
                    direction="column"
                    gap={2}
                    width="50%"
                    sx={{
                        marginLeft: "25%",
                    }}
                >
                    <Grid width="100%">
                        <GlassInput
                            autoFocus
                            required
                            id="poll-title"
                            name="poll-title"
                            label="Título para la encuesta"
                            type="text"
                            kind="text input"
                            size="medium"
                            onChange={(e) => handleInputChange(e, "title")}
                            value={titleVal}
                        />
                    </Grid>

                    <Grid marginTop="1rem">
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Agregar opciones para votar
                        </Typography>
                    </Grid>

                    <Grid width="100%">
                        <GlassInput
                            autoFocus
                            required
                            id="poll-input"
                            name="poll-input"
                            label="Opción"
                            type="text"
                            kind="text input"
                            size="medium"
                            onChange={(e) => handleInputChange(e, "option")}
                            value={inputVal}
                            error={inputVal.length > 20}
                            helperText="Las opciones no pueden ser más de 20 caractéres."
                        />
                    </Grid>

                    <Grid width="100%">
                        <GlassButton
                            onClick={addOption}
                            fullWidth
                            disabled={inputVal.length > 20}
                        >
                            Agregar opción
                        </GlassButton>
                    </Grid>

                    {options.map((option, i) => (
                        <Grid
                            key={`poll-option-alert-${i}-id-${option.id}`}
                            width="100%"
                        >
                            <GlassAlert
                                title={option.title}
                                value={option.value}
                                id={option.id}
                                variant="info"
                                openFromProps
                                callback={removeOption}
                            />
                        </Grid>
                    ))}
                </Grid>
            </GlassModal>
        </>
    );
};

export default CreatePoll;
