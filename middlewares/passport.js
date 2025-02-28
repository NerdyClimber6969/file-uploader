const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthService = require('../services/AuthService.js');
const prisma = require('../prisma/prismaClient.js');
const bcryptjs = require('bcryptjs');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user  = await AuthService.getUserByUsername(username);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };

            const match = await bcryptjs.compare(password, user.hash);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            };

            return done(null, user);
        } catch(err) {
            return done(err);
        };
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        done(null, user);
    } catch (err) {
        done(err);
    };
});

module.exports = passport;