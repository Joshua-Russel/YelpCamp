if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const db = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const method = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const expressError = require("./script/expressError");
const campRoute = require("./routes/campground.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/users.js");
const helmet = require("helmet");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MongoStore = require("connect-mongo");
// process.env.DB_URL
const dbURL = "mongodb://127.0.0.1/yelpcamp";
db.connect(dbURL);
const conn = db.connection;
conn.on("error", console.error.bind(console, "connection error"));
conn.once("open", () => {
	console.log("db connected");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.listen(3000, () => {
	console.log("connected");
});
const store = MongoStore.create({
	mongoUrl: dbURL,
	crypto: {
		secret: process.env.SESSION_KEY,
	},

	touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
	console.log(e);
});
const sessionConfig = {
	store,
	name: "session",
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
	"https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/dmpvysisy/",
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	}),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.user = req.user;

	next();
});
app.use(method("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));

app.use("/camps", campRoute);
app.use("/camps/:id/reviews", reviewRoute);
app.use("/", userRoute);
app.get("/", (req, res) => {
	res.render("home");
});
app.all("*", (req, res, next) => {
	next(new expressError("not found", 404));
});
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = "Something went Wrong";
	res.status(status).render("error", { err });
});
