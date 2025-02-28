const prisma = require("../prisma/prismaClient.js");
const storageService = require('./StorageService.js');
const ServiceError = require('../errors/ServiceError.js');
const bcryptjs = require('bcryptjs');

class AuthService {
    static async getUserById(userId) {
        const user = await prisma.user.findUnique({ data: { id: userId } });
        return user;
    };

    static async getUserByUsername(username) {
        const user = await prisma.user.findUnique({ 
            where: { username: username }
        });
        return user;
    };


    static async register(newUserData) {
        const { username, firstName, lastName, password } = newUserData;

        // Check if user already exists
        const existingUser = await this.getUserByUsername(username);
        const existingUserStorage = storageService.getPath(username);
        if (existingUser || existingUserStorage) {
            throw new ServiceError(`User "${username}" already existed, please use another username`);
        };

        // Hash the password
        const hash = await bcryptjs.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({ 
            data: { username, firstName, lastName, hash } 
        });

        // Create storage for new user
        storageService.create(newUser.username);

        return { id: newUser.id, username, firstName, lastName };
    };
};

module.exports = AuthService