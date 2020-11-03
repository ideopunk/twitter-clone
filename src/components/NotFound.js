import React from "react";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";

import { Link, useRouteMatch, useLocation } from "react-router-dom";

const NotFound = () => {
	console.log(useLocation());
	return (
		<div className="profile center-feed">
			<div className="profile-header">
				<Link
					to="/"
					className="profile-home-link"
					style={{ textDecoration: "none", color: "black" }}
				>
					<SideArrow />
					<div className="profile-home-link-text">
						<h3 className="no-dec">Profile</h3>
					</div>
				</Link>
				<div className="profile-header-image" />
				<div className="profile-card">
					<h3>Filler</h3>
				</div>
			</div>
			<div className="feed">
				<h3>This account doesn't exist lol</h3>
                <p>Try searching for another.</p>
			</div>
		</div>
	);
};

export default NotFound;
