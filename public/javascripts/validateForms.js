//bootstrap validation for forms
(function () {
	"use strict";
	const forms = document.querySelectorAll(".validate-form");
	Array.from(forms).forEach(function (form) {
		form.addEventListener(
			"submit",
			function (e) {
				if (!form.checkValidity()) {
					e.preventDefault();
					e.stopPropagation();
				}
				form.classList.add("was-validated");
			},
			false,
		);
	});
})();
