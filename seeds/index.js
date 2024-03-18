const mongo = require("mongoose");
const array = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const model = require("../models/campgrounds");
// "mongodb://127.0.0.1/yelpcamp"; local db url
const dbUrl = process.env.DB_URL; // cloud or local db url
mongo.connect(dbUrl);
mongo.connection.on("error", console.error.bind(console, "connection error"));
mongo.connection.once("open", () => {
	console.log("db connected");
});
const sample = function (array) {
	return array[Math.floor(Math.random() * array.length)];
};
const newseed = async () => {
	await model.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const rand = Math.floor(Math.random() * 1000);
		const rs = Math.floor(Math.random() * 20) + 10;
		const camp = new model({
			location: `${array[rand].city},${array[rand].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			price: rs,
			geometry: {
				type: "Point",
				coordinates: [array[rand].longitude, array[rand].latitude],
			},
			images: [
				{
					url: "https://res.cloudinary.com/dmpvysisy/image/upload/v1710593669/YelpCamp/mountains-1899264_640_euybug.jpg", //provide your cloudinary url
					filename: "YelpCamp/mountains-1899264_640_euybug.jpg", //provide the path of the image
				},
				{
					url: "https://res.cloudinary.com/dmpvysisy/image/upload/v1710593666/YelpCamp/download_r31n88.jpg", //provide your cloudinary url
					filename: "YelpCamp/download_r31n88.jpg", //provide the path of the image
				},
				{
					url: "https://res.cloudinary.com/dmpvysisy/image/upload/v1710593664/YelpCamp/download_1_wsw4zn.jpg", //provide your cloudinary url
					filename: "YelpCamp/download_1_wsw4zn.jpg", //provide the path of the image
				},
			],
			author: "65f07345f4c319294ea80acb", // hardcode some user id for initial seeding of database
			description:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda eveniet enim quos impedit accusamus, fugit alias quo iure amet doloribus cumque eaque fuga nulla vitae, aspernatur excepturi rerum quasi magnam?",
		});
		await camp.save();
	}
};

newseed().then(() => {
	mongo.connection.close();
});
