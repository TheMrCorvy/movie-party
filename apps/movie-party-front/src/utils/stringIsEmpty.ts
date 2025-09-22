const stringIsEmpty = (str: string) => {
    return (
        str === null ||
        !str ||
        str.match(/^ *$/) !== null ||
        str.trim().length === 0
    );
};

export default stringIsEmpty;
