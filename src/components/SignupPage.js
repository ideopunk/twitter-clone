import React, { useState } from "react";
import { auth, db } from "../config/fbConfig";

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

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(user, password, email);
		auth.createUserWithEmailAndPassword(email, password).then((cred) => {
			console.log(cred);
			// add cred to database....
			setUser("")
			setEmail("")
			setPassword("")
		});
	};

	return (
		<div className="signup-page">
			<h3>Create your account</h3>
			<form onSubmit={(e) => handleSubmit(e)}>
				<label>
					Name
					<input required onChange={(e) => handleUserChange(e)} />
				</label>
				<label>
					Email
					<input required type="email" onChange={(e) => handleEmailChange(e)} />
				</label>
				<label>
					Password
					<input
						required
						type="password"
						minLength={6}
						onChange={(e) => handlePasswordChange(e)}
					/>
				</label>

				<p>
					By signing up, you agree to the <a href="#">Terms of Service</a> and{" "}
					<a href="#">Privacy policy</a>.
				</p>
				<input type="submit" value="Sign up" />
			</form>
		</div>
	);
};

export default SignupPage;
