import { ChangeEvent, useEffect, useState } from "react";
import { generateId } from "@repo/shared-utils";
import { PollOption } from "@repo/type-definitions";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { createPollSerice } from "../../services/pollService";
import { ModalAction } from "../GlassModal";
import { AlertCallbackParams } from "../GlassAlert";

const usePollLogic = () => {
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

    const openModal = async () => {
        setModalOpen(true);
    };

    return {
        openModal,
        removeOption,
        modalActions,
        addOption,
        handleInputChange,
        modalOpen,
        disabledBtn,
        closeModal,
        titleVal,
        inputVal,
        options,
    };
};

export default usePollLogic;
