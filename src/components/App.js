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
	const [userImage, setUserImage] = useState(null);
	const [userAt, setUserAt] = useState(null);
	const [userName, setUserName] = useState(null);
	const [userFollows, setUserFollows] = useState([]);
	const [userFollowers, setUserFollowers] = useState([]);
	const [userTweets, setUserTweets] = useState([]);
	const [userLikes, setUserLikes] = useState([]);
	const [userRetweets, setUserRetweets] = useState([]);
	const [userBio, setUserBio] = useState("");
	const [userJoinDate, setUserJoinDate] = useState({});

	// listen for auth status changes
	useEffect(() => {
		console.log("use effect");
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				setUserID(user.uid);
				console.log(user.uid)
				db.collection("users")
					.doc(user.uid)
					.get()
					.then((snapshot) => {
						const data = snapshot.data();
						console.log("app data");
						setUserAt(data.at);
						setUserName(data.name);

						// set optional data if we have it.
						data.follows && setUserFollows(data.follows);
						data.followers && setUserFollowers(data.followers);
						data.tweets && setUserTweets(data.tweets);
						data.likes && setUserLikes(data.likes);
						data.retweets && setUserRetweets(data.retweets);
						data.bio && setUserBio(data.bio);
						setUserJoinDate(data.joinDate);
					});

				// set user image and header,
				storage
					.ref("profile_pictures/" + user.uid + ".png")
					.getDownloadURL()
					.then((url) => setUserImage(url))
					.catch(() => {
						setUserImage(Leaf);
					});
			} 
		});
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				{/* If the user is logged in, wait to render until the context is set */}
				<UserContext.Provider
					value={{
						userID: userID,
						userImage: userImage,
						userAt: userAt,
						userName: userName,
						userFollows: userFollows,
						userFollowers: userFollowers,
						userTweets: userTweets,
						userLikes: userLikes,
						userRetweets: userRetweets,
						userBio: userBio,
						userJoinDate: userJoinDate,
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
