const { Router } = require('express')
const passport = require('../passport.js');
const { createUserPost } = require('../controllers/indexControllers.js');

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.render("index", { user: req.user }));

indexRouter.get('/sign-up', (req, res) => res.render('sign-up'));
indexRouter.post('/sign-up', createUserPost);

indexRouter.get('/login', (req, res) => res.render('login'));
indexRouter.post(
    '/login', 
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

indexRouter.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.log(err.message);
            return next(err);
        };

        res.redirect("/");
    });
});

module.exports = indexRouter;