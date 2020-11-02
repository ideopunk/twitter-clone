import React, { useContext, Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
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
const Profile = lazy(() => import("./Profile"));
const Explore = lazy(() => import("./Explore"));
const Notifications = lazy(() => import("./Notifications"));

const Main = (props) => {
	const { userID, userAt } = useContext(UserContext);
	return (
		<div className="main">
			<Menu />

			{userID ? "" : <LoginPrompt />}
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
					<Route exact path="/:userAt">
						<Profile />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Suspense>

			<div className="sidebar">
				<Search />
				{userID ? "" : <LoginCard />}
				<FollowSuggests />
				<TOS />
			</div>
		</div>
	);
};

export default Main;
