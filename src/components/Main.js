import React, { useContext, Suspense, lazy, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import LoginPrompt from "./LoginPrompt";
import LoaderContainer from "./reusables/LoaderContainer";
import Messages from "./Messages";
import Menu from "./Menu";
import Search from "./reusables/Search";
import LoginCard from "./reusables/LoginCard";
import FollowSuggests from "./reusables/FollowSuggests";
import TOS from "./reusables/TOS";
import UserContext from "./context/context.js";
const Home = lazy(() => import("./Home"));
const ProfileRoutes = lazy(() => import("./ProfileRoutes"));
const Explore = lazy(() => import("./Explore"));
const Notifications = lazy(() => import("./Notifications"));
const TweetAndReplies = lazy(() => import("./TweetAndReplies"));
const Hashtag = lazy(() => import("./Hashtag"));

const Main = (props) => {
	const { userID } = useContext(UserContext);
	console.log(userID);


	return (
		<div className="main">
			<Menu />

			{!userID && <LoginPrompt />}

			{userID ? (
				<Suspense fallback={<LoaderContainer />}>
					<Switch>
						<Route exact path="/explore">
							<Explore />
						</Route>

						<Route exact path="/notifications">
							<Notifications />
						</Route>
						<Route exact path="/messages">
							<Messages />
						</Route>
						<Route path="/hashtag/:tag">
							<Hashtag />
						</Route>
						<Route path="/tweet/:tweetID">
							<TweetAndReplies />
						</Route>
						<Route path="/:profile">
							<ProfileRoutes />
						</Route>
						<Route exact path="/">
							<Home />
						</Route>
					</Switch>
				</Suspense>
			) : (
				<Suspense fallback={<LoaderContainer />}>
					<Switch>
						<Route exact path="/">
							<Explore />
						</Route>
					</Switch>
				</Suspense>
			)}

			<div className="sidebar">
				<Search />
				{!userID && <LoginCard />}
				<FollowSuggests />
				<TOS />
			</div>
		</div>
	);
};

export default Main;
