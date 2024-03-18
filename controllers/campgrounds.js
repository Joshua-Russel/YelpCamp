const { cloudinary } = require("../cloudinary");
const campgroundModel = require("../models/campgrounds");
const expressError = require("../script/expressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_KEY;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.homePage = async (req, res) => {
	const camps = await campgroundModel.find({});
	res.render("camps/homePage", { camps });
};

module.exports.createCampForm = (req, res) => {
	res.render("camps/new");
};

module.exports.showCamp = async (req, res) => {
	const { id } = req.params;

	const camp = await campgroundModel
		.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("author");

	if (!camp) {
		req.flash("error", "Cannot find camp");
		return res.redirect("/camps");
	}
	res.render("camps/details", { camp });
};

module.exports.createCamp = async (req, res, next) => {
	const data = await geocoder
		.forwardGeocode({
			query: req.body.camps.location,
			limit: 1,
		})
		.send();

	const camps = new campgroundModel(req.body.camps);
	camps.geometry = data.body.features[0].geometry;
	camps.images = req.files.map((f) => {
		return { url: f.path, filename: f.filename };
	});
	camps.author = req.user._id;
	await camps.save();

	req.flash("success", "Sucessfully created camps");
	res.redirect(`/camps/${camps._id}`);
};

module.exports.editCampForm = async (req, res) => {
	const { id } = req.params;

	const camps = await campgroundModel.findById(id);
	if (!camps) {
		req.flash("error", "Cannot find camp");
		return res.redirect("/camps");
	}

	res.render("camps/edit", { camps });
};
module.exports.editCamp = async (req, res, next) => {
	if (!req.body.camps) throw new expressError("Invalid Data", 400);

	const { id } = req.params;
	const img = req.files.map((f) => {
		return { url: f.path, filename: f.filename };
	});
	const camps = await campgroundModel.findByIdAndUpdate(id, req.body.camps, {
		new: true,
	});

	camps.images.push(...img);
	await camps.save();
	if (req.body.deleteImages) {
		for (let fname of req.body.deleteImages) {
			await cloudinary.uploader.destroy(fname);
		}
		await camps.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash("success", "Successfully updated");
	res.redirect(`/camps/${id}`);
};

module.exports.deleteCamp = async (req, res) => {
	const { id } = req.params;

	await campgroundModel.findByIdAndDelete(id);
	req.flash("success", "Sucessfully deleted camp!!");
	res.redirect("/camps");
};
