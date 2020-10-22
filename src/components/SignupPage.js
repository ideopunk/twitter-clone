import React, { useState } from "react";

const SignupPage = () => {
	const [user, setUser] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleUserChange = (e) => {
		setUser(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = () => {
		console.log(user, password, email);
	};

	return (
		<div className="signup-page">
			<h3>Create your account</h3>
			<form onSubmit={handleSubmit}>
				<label>
					Name
					<input onChange={(e) => handleUserChange(e)} />
				</label>
				<label>
					Email
					<input type="email" onChange={(e) => handleEmailChange(e)} />
				</label>
				<label>
					Password
					<input type="password" onChange={(e) => handlePasswordChange(e)} />
				</label>

				<p>
					By signing up, you agree to the <a href="#">Terms of Service</a> and{" "}
					<a href="#">Privacy policy</a>.
				</p>
				<input type="submit" value="Sign up"/>
			</form>
		</div>
	);
};

export default SignupPage;
