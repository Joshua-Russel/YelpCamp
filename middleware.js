const model = require("./models/campgrounds");
const review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const expressError = require("./script/expressError");
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.URL = req.originalUrl;
		req.flash("error", "Login required");
		return res.redirect("/login");
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campgrounds = await model.findById(id);
	if (!campgrounds.author.equals(req.user._id)) {
		req.flash("error", "Access Denied!");
		return res.redirect(`/camps/${id}`);
	}
	next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const reviews = await review.findById(reviewId);
	if (!reviews.author.equals(req.user._id)) {
		req.flash("error", "Access Denied!");
		return res.redirect(`/camps/${id}`);
	}
	next();
};
module.exports.validateCamps = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	console.log(req.files);
	if (error) {
		const details = error.details.map((ele) => ele.message).join(",");
		throw new expressError(details, 400);
	}
	next();
};
module.exports.validateReviews = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);

	if (error) {
		const details = error.details.map((ele) => ele.message).join(",");
		throw new expressError(details, 400);
	}
	next();
};
