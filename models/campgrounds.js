const mon = require("mongoose");
const Review = require("./review");

const Schema = mon.Schema;
const ImageSchema = new Schema({
	url: String,
	filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});
// mon.connect("mongodb://127.0.0.1:27017/yelpcamp");
const opt = { toJSON: { virtuals: true } };
const campSchema = new Schema(
	{
		title: String,
		images: [ImageSchema],
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
	},
	opt,
);
campSchema.virtual("properties.popupstring").get(function () {
	return `<strong><a href='/camps/${this._id}'>${this.title}</a></strong>
	<p>${this.description.substring(0, 20)}</p>`;
});
campSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		console.log(doc.reviews);
		await Review.deleteMany({ _id: { $in: doc.reviews } });
	}
});
module.exports = mon.model("Camp", campSchema);
