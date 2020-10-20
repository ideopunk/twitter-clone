import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const Menu = () => {
	return (
		<Router>
			<div className="menu">
				<Link to="/" className="menu-item">
					<span className="menu-icon"></span>
				</Link>
				<Link to="/" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">Home</span>
				</Link>
				<Link to="/explore" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">Explore</span>
				</Link>
				<Link to="/notifications" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">Notifications</span>
				</Link>
				<Link to="/messages" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">Messages</span>
				</Link>
				<Link to="/profile" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">Profile</span>
				</Link>
				<Link to="/more" className="menu-item">
					<span className="menu-icon"></span>
					<span className="menu-item-name">More</span>
				</Link>
				<Link to="/compose/tweet" className="menu-item">
					<button>Tweet</button>
				</Link>
				<li className="menu-item">
					<button className="menu-profile-button"></button>
				</li>
			</div>


		</Router>
	);
};

export default Menu;
