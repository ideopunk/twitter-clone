import React from "react";
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Menu from "./Menu";
import Home from "./Home";
import Profile from "./Profile";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import "../style/App.scss";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<ul className="menu">
					<li>
						<NavLink activeClassName="menu-item-active" to="/" exact={true} className="menu-item">
							<span className="menu-icon"></span>
						</NavLink>
					</li>
					<li>
						<NavLink activeClassName="menu-item-active" to="/" exact={true} className="menu-item">
							<span className="menu-icon"></span>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/explore"
							className="menu-item"
						>
							<span className="menu-icon"></span>
							Explore
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/notifications"
							className="menu-item"
						>
							<span className="menu-icon"></span>
							Notifications
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/messages"
							className="menu-item"
						>
							<span className="menu-icon"></span>
							Messages
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/profile"
							className="menu-item"
						>
							<span className="menu-icon"></span>
							Profile
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/more"
							className="menu-item"
						>
							<span className="menu-icon"></span>
							More
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/compose/tweet"
							className="menu-item"
						>
							<button>Tweet</button>
						</NavLink>
					</li>
					<li className="menu-item">
						<button className="menu-profile-button"></button>
					</li>
				</ul>
				<Switch>
					<Route exact path="/" component={Home} />
				</Switch>
				<Switch>
					<Route exact path="/explore" component={Explore} />
				</Switch>
				<Switch>
					<Route exact path="/notifications" component={Notifications} />
				</Switch>
				<Switch>
					<Route exact path="/messages" component={Messages} />
				</Switch>
				<Switch>
					<Route exact path="/profile" component={Profile} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
