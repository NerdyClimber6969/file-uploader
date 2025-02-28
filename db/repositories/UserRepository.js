const DatabaseError = require('../../errors/DatabaseError.js');
const { handleUnexpectedError } = require('../../utils/utils');

class UserRepository {
    #prisma;

    constructor(prisma) {
        this.#prisma = prisma;
    };

    searchUser = handleUnexpectedError(
        async (username) => {
            const user = await this.#prisma.user.findUnique({ 
                where: { username: username },
                select: { username: true }
            });

            if (!user) {
                return false;
            };

            return true;
        },
        DatabaseError.handle
    );

    getUser = handleUnexpectedError(
        async (userId) => {
            const user = await this.#prisma.user.findUnique({ data: { id: userId } });
            return user;
        },
        DatabaseError.handle
    );

    createUser = handleUnexpectedError(
        async (username, firstName, lastName, hash) => {
            const user = await this.#prisma.user.create({ data: { username, firstName, lastName, hash } });
            return user;
        },
        DatabaseError.handle
    );
};

module.exports = UserRepository;