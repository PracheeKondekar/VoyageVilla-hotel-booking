const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.signup =async(req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to VoyageVilla!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
} 

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login= async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};