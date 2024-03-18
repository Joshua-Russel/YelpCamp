const User = require("../models/user.js");

module.exports.registerForm = (req, res) => {
	res.render("users/register");
};

module.exports.logoutUser = (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logout Successful");
		res.redirect("camps");
	});
};

module.exports.registerUser = async (req, res, next) => {
	try {
		const { username, password, email } = req.body;
		const user = new User({ username, email });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, function (err) {
			if (err) return next(err);

			req.flash("success", "Welcome to Yelpcamp");
			res.redirect("/camps");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
};

module.exports.loginForm = (req, res) => {
	res.render("users/login");
};

module.exports.loginUser = (req, res) => {
	req.flash("success", "Welcome Back");
	const redirect = req.session.URL || "/camps";
	delete req.session.URL;
	res.redirect(redirect);
};
