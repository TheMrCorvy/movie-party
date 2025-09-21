const stringIsEmpty = (str: string) => {
    if (typeof str !== "string") {
        return true;
    }
    return str.trim().length === 0;
};

export default stringIsEmpty;
