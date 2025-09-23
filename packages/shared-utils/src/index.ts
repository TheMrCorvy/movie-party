import { v4 } from "uuid";

export const generateId = () => {
    return v4();
};

export const stringIsEmpty = (str: string) => {
    return (
        str === null ||
        !str ||
        str.match(/^ *$/) !== null ||
        str.trim().length === 0
    );
};
