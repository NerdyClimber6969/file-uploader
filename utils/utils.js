const handleUnexpectedError = (fn, errorHandler = () => {}) => {
    return (...args) => {
        const result = fn(...args); 
        return Promise.resolve(result).catch(errorHandler)
    };
};

function zip(...arrays) {
    if (arrays.length === 0) return [];

    let maxLength = 0
    for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > maxLength) {
            maxLength = arrays[i].length;
        };
    };
    const result = new Array(maxLength);
    
    for (let i = 0; i < maxLength; i++) {
        result[i] = new Array(arrays.length);

        for (let j = 0; j < arrays.length; j++) {
            result[i][j] = arrays[j][i] ?? undefined;
        };
    };
    
    return result;
};

module.exports = { handleUnexpectedError, zip }