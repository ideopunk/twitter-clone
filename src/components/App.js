import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth, storage } from "../config/fbConfig";
import Main from "./Main";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserContext from "./context/context.js";
import "../style/App.scss";


const App = () => {
	const [userID, setUserID] = useState(null);
	const [userImage, setUserImage] = useState(null);
	const [userAt, setUserAt] = useState(null);

	// listen for auth status changes
	useEffect(() => {
		console.log("use effect");
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (!user) {
				setUserID(null);
				setUserImage(null);
			} else {
				setUserID(user.uid);
				db.collection("users")
					.doc(user.uid)
					.get()
					.then((snapshot) => {
						const data = snapshot.data();
						console.log(data);
						setUserAt(data.at);
					});
				storage
					.ref("profile_pictures/" + user.uid + ".png")
					.getDownloadURL()
					.then((url) => setUserImage(url));
			}
		});
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				<UserContext.Provider
					value={{ userID: userID, userImage: userImage, userAt: userAt }}
				>
					<Switch>
						<Route exact path="/login">
							{userID ? <Redirect to="/" /> : <LoginPage />}
						</Route>
						<Route exact path="/signup">
							{userID ? <Redirect to="/" /> : <SignupPage />}
						</Route>
						<Route path="/">
							<Main userID={userID} userAt={userAt} userImage={userImage} />
						</Route>
					</Switch>
				</UserContext.Provider>
			</div>
		</BrowserRouter>
	);
};

export default App;
