import React, { useState } from "react";
import { Link } from "react-router-dom";

import fish from "../assets/fish.svg";
import { auth } from "../config/fbConfig";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		auth.signInWithEmailAndPassword(email, password)
			.then((cred) => {
				setEmail("");
				setPassword("");
			})
			.catch((err) => {
				console.log(err);
				if (err.code === "auth/wrong-password") {
					setError("I think you got your password wrong!!");
				} else if (err.code === "auth/user-not-found") {
					setError("That email isn't in our records!");
				} else if (err.code === "auth/invalid-email") {
					setError("That's not an email address!");
				}
			});
	};

	return (
		<div className="login-container">
			<div className="login-page">
				<span className="menu-icon" style={{textAlign: "center"}}>
					<img
						className="menu-logo"
						style={{ marginBottom: "2rem"}}
						src={fish}
						alt="fish"
					/>
				</span>
				<h3>Log in to Fake Twitter</h3>
				{error && (
					<p style={{ color: "red" }}>
						The email and password you entered did not match our records. Please
						double-check and try again.
					</p>
				)}
				<form className="login-form" onSubmit={(e) => handleSubmit(e)}>
					<label className="form-label">
						<span className="form-name">Email</span>
						<input
							className="form-input"
							type="email"
							maxLength={50}
							required
							onChange={(e) => handleEmailChange(e)}
							value={email}
						/>
					</label>

					<label className="form-label">
						<span className="form-name">Password</span>
						<input
							type="password"
							className="form-input"
							maxLength={50}
							required
							onChange={(e) => handlePasswordChange(e)}
							value={password}
						/>
					</label>

					<input
						className="lg-btn btn"
						style={{ width: "100%" }}
						type="submit"
						value="Log in"
					/>
					<div>
						<Link to="signup" className="hover-under">
							Sign up for Fake Twitter
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
