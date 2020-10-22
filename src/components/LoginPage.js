import React, { useState } from "react";
import fish from "../assets/fish-outline.svg";
import { auth } from "../config/fbConfig";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		auth.signInWithEmailAndPassword(email, password).then((cred) => {
			console.log(cred.user);
			setEmail("");
			setPassword("");
		});
	};

	return (
		<div className="login-container">
			<div className="login-page">
				<span className="menu-icon">
					<img
						className="menu-logo"
						style={{ marginBottom: "2rem" }}
						src={fish}
						alt="fish"
					/>
				</span>
				<h3>Log in to Fake Twitter</h3>
				<form className="login-form" onSubmit={(e) => handleSubmit(e)}>
					<label>
						Email or username
						<input required onChange={(e) => handleEmailChange(e)} />
					</label>
					<label>
						Password
						<input type="password" required onChange={(e) => handlePasswordChange(e)} />
					</label>
					<input className="lg-btn" style={{}} type="submit" value="Log in" />
					<div>
						<a href="#">Forgot password?</a>
						<a href="#">Sign up for Fake Twitter</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
