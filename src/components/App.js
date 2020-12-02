import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth, storage } from "../config/fbConfig";
import LoaderContainer from "./reusables/LoaderContainer";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserContext from "./context/userContext.js";
import DeviceContext from "./context/deviceContext.js";

import "../style/App.scss";
import Leaf from "../assets/leaf-outline.svg";
const Main = lazy(() => import("./Main"));

const App = () => {
	const [userID, setUserID] = useState(null);
	const [userData, setUserData] = useState({});
	const [width, setWidth] = useState(767);

	// listen for auth status changes
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user)
				setUserID(user.uid);
				db.collection("users")
					.doc(user.uid)
					.onSnapshot((snapshot) => {
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
					});

				// set user image and header,
				storage
					.ref("profile_pictures/" + user.uid + ".png")
					.getDownloadURL()
					.then((url) => {
						setUserData((u) => ({ ...u, image: url }));
					})
					.catch(() => {
						setUserData((u) => ({ ...u, image: Leaf }));
					});
			} else {
				// don't start removing things until we're sure we don't have a user.
				setUserID(-1);
				setUserData({});
			}
		});

		return () => unsubscribe();
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
				{/* If the user is logged in, wait to render until the context is set */}
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
							<Route path="/">
								{/* This is bad for unlogged-in users */}
								<Suspense fallback={<LoaderContainer />}>
									<Main />
								</Suspense>
							</Route>
						</Switch>
					</UserContext.Provider>
				</DeviceContext.Provider>
				{/* )} */}
			</div>
		</BrowserRouter>
	);
};

export default App;
