import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../config/fbConfig";

const SignupPage = () => {
	const [userAt, setUserAt] = useState("");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState(null);
	const [allAts, setAllAts] = useState([]);
	const [legitAt, setLegitAt] = useState(true);

	// on pageload, grab all the usernames, to be sure they're unique.
	useEffect(() => {
		let tempArray = [];
		db.collection("users")
			.get()
			.then((snapshot) =>
				snapshot.forEach((user) => {
					console.log(user.data().at);
					tempArray.push(user.data().at);
				})
			)
			.then(setAllAts(tempArray));
	}, []);

	const handleFileChange = (e) => {
		e.target.files[0] ? setImage(e.target.files[0]) : console.log("naw");
	};

	const handleUserAtChange = (e) => {
		console.log(e.target.value);
		allAts.includes(e.target.value) ? setLegitAt(false) : setLegitAt(true);
		switch (e.target.value) {
			case "profile":
			case "notifications":
			case "explore":
			case "home":
			case "messages":
			case "menu":
			case "tweet":
				setLegitAt(false);
				break;
			default:
				console.log("all good");
		}
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
		if (legitAt) {
			e.preventDefault();
			console.log(userAt, userName, password, email);
			auth.createUserWithEmailAndPassword(email, password)
				.then((cred) => {
					db.collection("users")
						.doc(cred.user.uid)
						.set({
							at: userAt,
							name: userName,
							likes: [],
							follows: [cred.user.id],
							followers: [cred.user.id],
							joinDate: new Date(),
						});
					return cred.user.uid;
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
		}
	};

	return (
		<div className="login-container">
			<div className="login-page">
				<h3>Create your account</h3>
				<form className="login-form" onSubmit={(e) => handleSubmit(e)}>
					<label className="form-label">
						<span className="form-name">Profile picture</span>
						<input className="form-input" type="file" onChange={handleFileChange} />
					</label>
					<label className="form-label">
						<span className="form-name">At</span>
						{!legitAt ? <p className="signup-warning">Username has been taken!</p> : ""}
						<input
							className="form-input"
							required
							onChange={(e) => handleUserAtChange(e)}
						/>
					</label>
					<label className="form-label">
						<span className="form-name">Name</span>
						<input
							className="form-input"
							required
							onChange={(e) => handleUserNameChange(e)}
						/>
					</label>
					<label className="form-label">
						<span className="form-name">Email</span>
						<input
							className="form-input"
							required
							type="email"
							onChange={(e) => handleEmailChange(e)}
						/>
					</label>
					<label className="form-label">
						<span className="form-name">Password</span>
						<input
							className="form-input"
							required
							type="password"
							minLength={6}
							onChange={(e) => handlePasswordChange(e)}
						/>
					</label>

					<div>
						<Link to="login">Already have an account? Login here!</Link>
					</div>
					<p>This is all fake! It's all for a portfolio! Have fun!</p>
					<input className="btn" type="submit" value="Sign up" />
				</form>
			</div>
		</div>
	);
};

export default SignupPage;
