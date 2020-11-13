import React, { useState } from "react";
import { Link } from "react-router-dom";

import fish from "../assets/fish-outline.svg";
import { auth } from "../config/fbConfig";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [reset, setReset] = useState(false);

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

	const toggleReset = () => {
		setReset(true);
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
					<label className="form-label">
						<span className="form-name">Email</span>
						<input
							className="form-input"
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
						<span onClick={toggleReset}>Forgot password?</span> · <Link to="signup">Sign up for Fake Twitter</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
