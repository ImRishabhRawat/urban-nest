// githubAuth.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (user) => {
	return jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: "15d",
		}
	);
};

router.get(
	"/",
	passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
	"/callback",
	passport.authenticate("github", { failureRedirect: "/login/failed" }),
	(req, res) => {
		if (!req.user) {
			return res.redirect("/login/failed");
		}
		const token = generateToken(req.user);
		const user = req.user;
		res.redirect(
			`${
				process.env.CLIENT_SITE_URL
			}/oauth-success?token=${token}&user=${encodeURIComponent(
				JSON.stringify(user)
			)}`
		);
	}
);

export default router;
