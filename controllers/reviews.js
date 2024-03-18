const reviewModel = require("../models/review.js");
const campgroundModel = require("../models/campgrounds");

module.exports.createReview = async (req, res, next) => {
	const camp = await campgroundModel.findById(req.params.id);
	const review = new reviewModel(req.body.review);
	review.author = req.user._id;
	camp.reviews.push(review);
	await review.save();
	await camp.save();
	req.flash("success", "Created new review");
	res.redirect(`/camps/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await campgroundModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await reviewModel.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully deleted review");
	res.redirect(`/camps/${id}`);
};
