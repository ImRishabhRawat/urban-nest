import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import dotenv from "dotenv";
import User from "./models/UserSchema.js"; // Ensure the path is correct and includes the .js extension

dotenv.config(); // Load environment variables

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/v1/Oauth/google/callback",
			scope: ["profile", "email"], // Add the scope parameter here
		},
		async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
				let user = await User.findOne({ email: profile.emails[0].value });
				if (!user) {
					user = new User({
						email: profile.emails[0].value,
						name: profile.displayName,
						photo: profile.photos[0].value,
						role: "student", // Default role, can be changed based on UI selection
						oauthProvider: "google", // Set the OAuth provider
					});
					await user.save();
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "/api/v1/auth/github/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let email =
					profile.emails && profile.emails.length > 0
						? profile.emails[0].value
						: null;

				// If email is not present in the profile, fetch it from GitHub API
				if (!email) {
					const emailsResponse = await axios.get(
						"https://api.github.com/user/emails",
						{
							headers: {
								Authorization: `token ${accessToken}`,
							},
						}
					);
					const primaryEmailObj =
						emailsResponse.data.find((emailObj) => emailObj.primary) ||
						emailsResponse.data[0];
					email = primaryEmailObj ? primaryEmailObj.email : null;
				}

				if (!email) {
					return done(new Error("No email found for the GitHub user"), null);
				}

				let user = await User.findOne({ email });
				if (!user) {
					user = new User({
						email,
						name: profile.username,
						photo: profile.photos[0].value,
						role: "student", // Default role, can be changed based on UI selection
					});
					await user.save();
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, false);
	}
});
