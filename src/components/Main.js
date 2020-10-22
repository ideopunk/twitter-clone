import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import LoginPrompt from "./LoginPrompt";
import Profile from "./Profile";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Menu from "./Menu";

const Main = (props) => {
	const { user } = props;
	return (
		<div className="main">
			<Menu />

			{user ? "" : <LoginPrompt />}

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
					<Profile />
				</Route>
				<Route path="/">
					<Home user={user} />
				</Route>
			</Switch>
		</div>
	);
};

export default Main;
