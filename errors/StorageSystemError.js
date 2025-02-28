class SystemStorageError extends Error {
    constructor(message, statusCode=500) {
        super(message);
        this.name = "SystemStorageError";
        this.statusCode = statusCode;
        this.isOperational = false;
    };

    static handle(error) {
        if (error instanceof SystemStorageError) {
            throw error
        };
        
        console.error("Error occurred while accessing system storage:", error.message);
        throw new SystemStorageError("Unexpected internal server error occured.");
    };
};

module.exports = SystemStorageError;