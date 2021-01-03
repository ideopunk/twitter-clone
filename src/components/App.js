import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth, storage } from "../config/fbConfig";
import VerificationPrompt from "./VerificationPrompt";
import Main from "./Main";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserContext from "./context/userContext.js";
import DeviceContext from "./context/deviceContext.js";
import "../style/App.scss";
import Leaf from "../assets/leaf-outline.svg";

const App = () => {
	const [userID, setUserID] = useState(null);
	const [userData, setUserData] = useState({});
	const [width, setWidth] = useState(767);
	const [verified, setVerified] = useState(false);

	// listen for auth status changes
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				setVerified(user.emailVerified);
				setUserID(user.uid);
				db.collection("users")
					.doc(user.uid)
					.onSnapshot(
						(snapshot) => {
							const data = snapshot.data();
							// set optional data if we have it.
							setUserData((u) => ({
								...u,
								joinDate: data.joinDate,
								bio: data.bio || "",
								retweets: data.retweets || [],
								likes: data.likes || [],
								tweets: data.tweets || [],
								followers: data.followers || [],
								follows: data.follows || [],
								at: data.at,
								name: data.name,
							}));
						},
						(err) => console.log(err)
					);

				// set user image and header,
				storage
					.ref("profile_pictures/" + user.uid + ".png")
					.getDownloadURL()
					.then((url) => {
						console.log("set image again!");
						setUserData((u) => ({ ...u, image: url }));
					})
					.catch(() => {
						console.log("set image again!");
						setUserData((u) => ({ ...u, image: Leaf }));
					});
			} else {
				// don't start removing things until we're sure we don't have a user.
				setUserID(-1);
				setUserData({ image: Leaf });
			}
		});

		// return () => unsubscribe();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width > 1000) {
				setWidth("comp");
			} else if (width > 767) {
				setWidth("tablet");
			} else {
				setWidth("mobile");
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("reize", handleResize);
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				{userID && userID !== -1 && !verified ? (
					<VerificationPrompt at={userData.at} />
				) : (
					<DeviceContext.Provider value={{ device: width }}>
						<UserContext.Provider
							value={{
								userID: userID,
								userImage: userData.image,
								userAt: userData.at,
								userName: userData.name,
								userFollows: userData.follows,
								userFollowers: userData.followers,
								userTweets: userData.tweets,
								userLikes: userData.likes,
								userRetweets: userData.retweets,
								userBio: userData.bio,
								userJoinDate: userData.joinDate,
							}}
						>
							<Switch>
								<Route exact path="/login">
									{userID && userID !== -1 ? <Redirect to="/" /> : <LoginPage />}
								</Route>
								<Route exact path="/signup">
									{userID && userID !== -1 ? <Redirect to="/" /> : <SignupPage />}
								</Route>
								<Route path="/">{userData.image && <Main />}</Route>
							</Switch>
						</UserContext.Provider>
					</DeviceContext.Provider>
				)}
			</div>
		</BrowserRouter>
	);
};

export default App;
