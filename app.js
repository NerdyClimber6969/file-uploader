require('dotenv').config();
const path = require('node:path');
const express = require('express');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma/prismaClient.js');
const session = require('express-session');
const passport = require('./middlewares/passport.js');
const indexRouter = require('./routes/indexRouters.js');
const foldersRouter = require('./routes/foldersRouter.js');
const filesRouter = require('./routes/filesRouter.js');

const PORT = 3000;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
        cookie: { maxAge: 1 * 60 * 60 * 1000 },
        name: 'sessionID',
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma,
            {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
            }   
        )
    })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/folders', foldersRouter);
app.use('/files', filesRouter);

app.listen(PORT, () => console.log(`now listening on PORT ${PORT}`));