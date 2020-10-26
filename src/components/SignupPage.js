import React, { useState } from "react";
import { auth, db, storage } from "../config/fbConfig";

const SignupPage = () => {
	const [userAt, setUserAt] = useState("");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState(null);

	const handleFileChange = (e) => {
		e.target.files[0] ? setImage(e.target.files[0]) : console.log("naw");
	};

	const handleUserAtChange = (e) => {
		setUserAt(e.target.value);
	};
	
	const handleUserNameChange = (e) => {
		setUserAt(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(userAt, userName, password, email);
		auth.createUserWithEmailAndPassword(email, password)
			.then((cred) => {
				db.collection("users").doc(cred.user.uid).set({ at: `@${userAt}` , name: userName});
				return cred.user.uid
			})
			.then((uid) => {

				const storageRef = storage.ref("profile_pictures/" + uid);
				const uploadTask = storageRef.put(image);
				uploadTask.on(
					"state_changed",

					// how it's going
					(snapshot) => {},

					// how it goofed it
					(error) => {
						console.log(error);
					},

					// how it succeeded
					() => {
						console.log("success");
					}
				);
			})
			.then(() => {
				setPassword("");
				setEmail("");
				setUserAt("");
				setUserName("");
			});
	};

	return (
		<div className="signup-page">
			<h3>Create your account</h3>
			<form onSubmit={(e) => handleSubmit(e)}>
				<label>
					Profile picture
					<input type="file" onChange={handleFileChange} />
				</label>
				<label>
					At
					<input required onChange={(e) => handleUserAtChange(e)} />
				</label>
				<label>
					Name
					<input required onChange={(e) => handleUserNameChange(e)} />
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
