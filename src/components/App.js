import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth, storage } from "../config/fbConfig";
import LoaderContainer from "./reusables/LoaderContainer";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserContext from "./context/context.js";
import "../style/App.scss";
import Leaf from "../assets/leaf-outline.svg";
const Main = lazy(() => import("./Main"));

const App = () => {
	const [userID, setUserID] = useState(null);
	const [userData, setUserData] = useState({});

	// listen for auth status changes
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
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
				setUserID(null);
				setUserData({});
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				{/* If the user is logged in, wait to render until the context is set */}
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
							{userID ? <Redirect to="/" /> : <LoginPage />}
						</Route>
						<Route exact path="/signup">
							{userID ? <Redirect to="/" /> : <SignupPage />}
						</Route>
						<Route path="/">
							{/* This is bad for unlogged-in users */}
							<Suspense fallback={<LoaderContainer />}>
								<Main />
							</Suspense>
						</Route>
					</Switch>
				</UserContext.Provider>
				{/* )} */}
			</div>
		</BrowserRouter>
	);
};

export default App;
