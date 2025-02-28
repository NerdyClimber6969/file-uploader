class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
        this.statusCode = 500;
        this.isOperational = false;
    };

    static handle(error) {
        console.error("Error occurred while querying database:", error.message);
        throw new DatabaseError("Database error occurred while retrieving.");
    };
};

module.exports = DatabaseError;