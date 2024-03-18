const express = require("express");
const router = express.Router();
const wrapAsync = require("../script/wrapAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const uploads = multer({ storage });
const {
	homePage,
	createCampForm,
	showCamp,
	createCamp,
	editCampForm,
	editCamp,
	deleteCamp,
} = require("../controllers/campgrounds.js");

const { validateCamps, isLoggedIn, isAuthor } = require("../middleware.js");

router.get("/", wrapAsync(homePage));

router
	.route("/create")
	.get(isLoggedIn, createCampForm)
	.post(
		isLoggedIn,
		uploads.array("image"),
		validateCamps,
		wrapAsync(createCamp),
	);

router.get("/:id", wrapAsync(showCamp));
router
	.route("/:id/edit")
	.get(isLoggedIn, isAuthor, wrapAsync(editCampForm))
	.put(
		isLoggedIn,
		isAuthor,
		uploads.array("image"),
		validateCamps,
		wrapAsync(editCamp),
	);

router.delete("/:id/delete", isLoggedIn, isAuthor, wrapAsync(deleteCamp));

module.exports = router;
