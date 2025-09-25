const fakeTimeout = async (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Data fetched!");
        }, delay);
    });
};

export default fakeTimeout;
