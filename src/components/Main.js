import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import LoginPrompt from "./LoginPrompt";
import Profile from "./Profile";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Menu from "./Menu";

const Main = () => {
	return (
		<div className="main">
			<Menu />

			<LoginPrompt />

			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/explore" component={Explore} />
				<Route exact path="/notifications" component={Notifications} />
				<Route exact path="/messages" component={Messages} />
				<Route exact path="/profile" component={Profile} />
			</Switch>
		</div>
	);
};

export default Main;
