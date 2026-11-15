// Wait for DOM to be ready (handles both module and regular script)
function init() {
	console.log("init() running");
	const root = document.documentElement;
	const themeToggle = document.getElementById("themeToggle");
	const savedTheme = localStorage.getItem("kevin-theme");
	if (savedTheme) root.dataset.theme = savedTheme;
	function updateThemeButton() {
		const light = root.dataset.theme === "light";
		themeToggle.setAttribute(
			"aria-label",
			light ? "Switch to dark theme" : "Switch to light theme",
		);
	}
	updateThemeButton();
	themeToggle.addEventListener("click", () => {
		console.log("Theme toggle clicked");
		root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
		localStorage.setItem("kevin-theme", root.dataset.theme);
		updateThemeButton();
	});

	const menuToggle = document.getElementById("menuToggle");
	const navLinks = document.getElementById("navLinks");
	menuToggle.addEventListener("click", () => {
		console.log("Menu toggle clicked");
		const open = navLinks.classList.toggle("open");
		menuToggle.setAttribute("aria-expanded", String(open));
		menuToggle.setAttribute(
			"aria-label",
			open ? "Close navigation" : "Open navigation",
		);
	});
	navLinks.querySelectorAll("a").forEach((link) =>
		link.addEventListener("click", () => {
			navLinks.classList.remove("open");
			menuToggle.setAttribute("aria-expanded", "false");
		}),
	);

	// Project filters
	const filterButtons = document.querySelectorAll(".filter");
	const projectCards = document.querySelectorAll(".project-card");
	console.log(
		"Filters:",
		filterButtons.length,
		"Cards:",
		projectCards.length,
	);

	if (filterButtons.length && projectCards.length) {
		filterButtons.forEach((button) =>
			button.addEventListener("click", () => {
				console.log("Filter clicked:", button.dataset.filter);
				filterButtons.forEach((item) =>
					item.classList.toggle("active", item === button),
				);
				const filter = button.dataset.filter;
				projectCards.forEach((card) => {
					card.hidden =
						filter !== "all" && card.dataset.category !== filter;
				});
			}),
		);
	}

	document.querySelectorAll(".architecture-toggle").forEach((button) =>
		button.addEventListener("click", () => {
			const panel = button.nextElementSibling;
			const expanded = button.getAttribute("aria-expanded") === "true";
			button.setAttribute("aria-expanded", String(!expanded));
			panel.hidden = expanded;
			button.querySelector("span").textContent = expanded ? "＋" : "−";
		}),
	);

	const skillSearch = document.getElementById("skillSearch");
	const skillGroups = [...document.querySelectorAll(".skill-group")];
	const noSkills = document.getElementById("noSkills");
	let searchTimeout = null;
	skillSearch.addEventListener("input", () => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const query = skillSearch.value.trim().toLowerCase();
			let visible = 0;
			skillGroups.forEach((group) => {
				const match = group.textContent.toLowerCase().includes(query);
				group.classList.toggle("filtered-out", !match);
				if (match) visible++;
			});
			noSkills.hidden = visible !== 0;
		}, 150);
	});

	const form = document.getElementById("contactForm");
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const fields = [
			{
				el: document.getElementById("name"),
				valid: (value) => value.trim().length >= 2,
				message: "Enter at least 2 characters.",
			},
			{
				el: document.getElementById("email"),
				valid: (value) => emailPattern.test(value.trim()),
				message: "Enter a valid email address.",
			},
			{
				el: document.getElementById("message"),
				valid: (value) => value.trim().length >= 10,
				message: "Enter at least 10 characters.",
			},
		];
		let valid = true;
		fields.forEach((field) => {
			const error = field.el.parentElement.querySelector(".error");
			const ok = field.valid(field.el.value);
			error.textContent = ok ? "" : field.message;
			field.el.setAttribute("aria-invalid", String(!ok));
			if (!ok) valid = false;
		});
		if (!valid) return;
		const name = document.getElementById("name").value.trim();
		const sender = document.getElementById("email").value.trim();
		const message = document.getElementById("message").value.trim();
		const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
		const body = encodeURIComponent(
			`${message}\n\nFrom: ${name}\nReply to: ${sender}`,
		);
		window.location.href = `mailto:kevinbmathew00@gmail.com?subject=${subject}&body=${body}`;
		document.getElementById("formNote").textContent =
			"Your email application should open with the message pre-filled. Review and send it there.";
	});

	const copyEmailBtn = document.getElementById("copyEmail");
	const originalCopyText = copyEmailBtn.textContent;
	copyEmailBtn.addEventListener("click", async (event) => {
		event.preventDefault();
		const email = "kevinbmathew00@gmail.com";
		try {
			await navigator.clipboard.writeText(email);
			copyEmailBtn.textContent = "Email copied ✓";
			setTimeout(() => {
				copyEmailBtn.textContent = originalCopyText;
			}, 2000);
		} catch {
			window.location.href = `mailto:${email}`;
		}
	});

	document.getElementById("year").textContent = new Date().getFullYear();
}

// Run on DOM ready (works for both module and regular script)
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
