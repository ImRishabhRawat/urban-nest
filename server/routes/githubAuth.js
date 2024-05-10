// githubAuth.js
import express from "express";
import passport from "passport";
import GitHubStrategy from "passport-github";

const router = express.Router();

passport.use(
	new GitHubStrategy(
		{
			client_id: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:8000/auth/github/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			// Find or create a user in your database and call `cb` with the user
		}
	)
);

router.get("/auth/github", passport.authenticate("github"));

router.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

export default router;
