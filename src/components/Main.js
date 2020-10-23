import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import LoginPrompt from "./LoginPrompt";
import Profile from "./Profile";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Menu from "./Menu";
import Search from "./reusables/Search";
import LoginCard from "./reusables/LoginCard";
import FollowSuggests from "./reusables/FollowSuggests";
import TOS from "./reusables/TOS";

const Main = (props) => {
	const { userID, userImage } = props;
	return (
		<div className="main">
			<Menu userID={userID} userImage={userImage} />

			{userID ? "" : <LoginPrompt />}

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
				<Route exact path="/profile">
					<Profile userID={userID} userImage={userImage} />
				</Route>
				<Route path="/">
					<Home userID={userID} userImage={userImage} />
				</Route>
			</Switch>

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
