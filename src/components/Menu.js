import React from "react";
import { NavLink } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import LoginPrompt from "./LoginPrompt";

import fish from "../assets/fish-outline.svg";
import { ReactComponent as HomeIcon } from "../assets/home-outline.svg";
import { ReactComponent as ExploreIcon } from "../assets/explore-outline.svg";
import { ReactComponent as NotificationsIcon } from "../assets/notifications-outline.svg";
import { ReactComponent as MessagesIcon } from "../assets/messages-outline.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile-outline.svg";
import { ReactComponent as MoreIcon } from "../assets/more-outline.svg";
import { ReactComponent as PowerIcon } from "../assets/power-outline.svg";
// import headshot from "../assets/headshot.png";

const Menu = (props) => {
	const { userAt, userID, userImage } = props;
	const signOut = () => {
		auth.signOut().then(() => {
			console.log("user signed out");
		});
	};

	return (
		<>
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
					<NavLink activeClassName="menu-item-active" to="/explore" className="menu-item">
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
						<MessagesIcon />
						<span className="menu-item-text">Messages</span>
					</NavLink>
				</li>
				<li>
					<NavLink activeClassName="menu-item-active" to="/profile" className="menu-item">
						<ProfileIcon />
						<span className="menu-item-text">Profile</span>
					</NavLink>
				</li>
				<li>
					<NavLink activeClassName="menu-item-active" to="/more" className="menu-item">
						<MoreIcon />
						<span className="menu-item-text">More</span>
					</NavLink>
				</li>
				<li>
					<NavLink activeClassName="menu-item-active" to="/compose/tweet">
						<button className="btn">Tweet</button>
					</NavLink>
				</li>
				<li className="">
					<button className="menu-profile-button" onClick={signOut}>
						<img src={userImage} alt="user-profile" className="profile-image" />
						<div className="menu-profile-button-text">
							<p>Conor</p>
							<p>{userAt}</p>
						</div>
						<PowerIcon className="menu-icon arrow" />
					</button>
				</li>
			</ul>
		</>
	);
};

export default Menu;
