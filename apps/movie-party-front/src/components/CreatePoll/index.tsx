import { Grid } from "@mui/material";
import { ChangeEvent, useState, type FC } from "react";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import GlassModal, { ModalAction } from "../GlassModal";
import GlassAlert, { AlertCallbackParams } from "../GlassAlert";
import { generateId } from "@repo/shared-utils";

interface Option {
    id: string;
    value: string;
    title: string;
}

const CreatePoll: FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [options, setOptions] = useState<Option[]>([]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputVal(e.target.value);
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
            },
        ]);
    };

    const modalActions: ModalAction[] = [
        {
            callback: () => setModalOpen(false),
            buttonLabel: "Cancelar",
            buttonProps: {
                border: true,
            },
        },
        {
            callback: () => console.log(options),
            buttonLabel: "Crear encuesta",
            buttonProps: {
                disabled: options.length > 4,
                border: true,
            },
        },
    ];

    const removeOption = (param: AlertCallbackParams) => {
        const newArr = options.filter((opt) => opt.id !== param.id);
        setOptions(newArr);
    };

    return (
        <>
            <GlassButton border onClick={() => setModalOpen(true)}>
                Iniciar encuesta
            </GlassButton>
            <GlassModal
                open={modalOpen}
                closeModalWithoutCallback={() => setModalOpen(false)}
                modalActions={modalActions}
                title="Iniciar Encuesta"
            >
                <Grid container direction="column" gap={2}>
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
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid width="100%">
                        <GlassButton border onClick={addOption} fullWidth>
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
