const express = require("express");
const router = express.Router();
const {
	registerForm,
	registerUser,
	loginForm,
	logoutUser,
	loginUser,
} = require("../controllers/users.js");
const passport = require("passport");
const passportAuth = passport.authenticate("local", {
	failureFlash: true,
	failureRedirect: "/login",
});
router.route("/register").get(registerForm).post(registerUser);

router.route("/login").get(loginForm).post(passportAuth, loginUser);

router.get("/logout", logoutUser);

module.exports = router;
