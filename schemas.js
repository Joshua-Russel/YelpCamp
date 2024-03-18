const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const extension = (joi) => {
	return {
		type: "string",
		base: joi.string(),
		messages: {
			"string.escapeHtml": "{{#label}} must not include HTML!",
		},
		rules: {
			escapeHtml: {
				validate(value, helpers) {
					const clean = sanitizeHtml(value, {
						allowedAttributes: {},
						allowedTags: [],
					});
					if (clean !== value)
						return helpers.error("string.escapeHtml", { value });
					return clean;
				},
			},
		},
	};
};
const Joi = BaseJoi.extend(extension);
module.exports.campgroundSchema = Joi.object({
	camps: Joi.object({
		title: Joi.string().required().escapeHtml(),
		price: Joi.number().required().min(0),
		description: Joi.string().required().escapeHtml(),
		location: Joi.string().required().escapeHtml(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required().escapeHtml(),
	}).required(),
});
