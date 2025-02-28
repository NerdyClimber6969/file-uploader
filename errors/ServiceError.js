class ServiceError extends Error {
    constructor(message, statusCode=400) {
        super(message);
        this.name = "ServiceError";
        this.statusCode = statusCode;
        this.isOperational = true;
    };

    static handle(error) {
        if (error instanceof ServiceError) {
            throw error
        };
        
        console.error("Error occurred in service layer:", error.message);
        throw new ServiceError("Unexpected internal server error occured.");
    };
};

module.exports = ServiceError;