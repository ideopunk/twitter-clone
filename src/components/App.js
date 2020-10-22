import React from "react";
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Home from "./Home";
import LoginPrompt from "./LoginPrompt";
import Profile from "./Profile";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import fish from "../assets/fish-outline.svg";
import { ReactComponent as HomeIcon } from "../assets/home-outline.svg";
import { ReactComponent as ExploreIcon } from "../assets/explore-outline.svg";
import { ReactComponent as NotificationsIcon } from "../assets/notifications-outline.svg";
import { ReactComponent as MessagesIcon } from "../assets/messages-outline.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile-outline.svg";
import { ReactComponent as MoreIcon } from "../assets/more-outline.svg";
import "../style/App.scss";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<ul className="menu">
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/"
							exact={true}
							className="menu-item"
						>
							<span className="menu-icon">
								<img className="menu-logo" src={fish} alt="fish" />
							</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/"
							exact={true}
							className="menu-item"
						>
							<HomeIcon />
							<span className="menu-item-text">Home</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/explore"
							className="menu-item"
						>
							<ExploreIcon />
							<span className="menu-item-text">Explore</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/notifications"
							className="menu-item"
						>
							<NotificationsIcon />
							<span className="menu-item-text">Notifications</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/messages"
							className="menu-item"
						>
							<span>
								<MessagesIcon />
							</span>
							<span className="menu-item-text">Messages</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/profile"
							className="menu-item"
						>
							<span>
								<ProfileIcon />
							</span>
							<span className="menu-item-text">Profile</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/more"
							className="menu-item"
						>
							<span>
								<MoreIcon />
							</span>
							<span className="menu-item-text">More</span>
						</NavLink>
					</li>
					<li>
						<NavLink activeClassName="menu-item-active" to="/compose/tweet">
							<button className="tweet-button">Tweet</button>
						</NavLink>
					</li>
					<li className="menu-item mrg-btm">
						<button className="menu-profile-button"></button>
					</li>
				</ul>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/explore" component={Explore} />
					<Route exact path="/notifications" component={Notifications} />
					<Route exact path="/messages" component={Messages} />
					<Route exact path="/profile" component={Profile} />
				</Switch>
			</BrowserRouter>
			<LoginPrompt />
		</div>
	);
}

export default App;
