const router = require("express").Router({ mergeParams: true });
const wrapAsync = require("../script/wrapAsync");
const { createReview, deleteReview } = require("../controllers/reviews.js");
const {
	isLoggedIn,
	validateReviews,
	isReviewAuthor,
} = require("../middleware.js");

router.post("/", isLoggedIn, validateReviews, wrapAsync(createReview));

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	wrapAsync(deleteReview),
);

module.exports = router;
