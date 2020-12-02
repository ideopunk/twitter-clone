import React from "react";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";

import { Link } from "react-router-dom";

const NotFound = (props) => {
	const { at } = props;

	return (
		<>
			<div className="profile-header">
				<Link
					to="/"
					className="top-link"
					style={{ textDecoration: "none", color: "black" }}
				>
					<SideArrow />
					<div className="top-link-text">
						<h3 className="no-dec">Profile</h3>
					</div>
				</Link>
				<div className="profile-header-image" />
				<div className="profile-card" style={{ paddingTop: "5rem" }}>
					<div className="fake-image" />

					<h3>{at}</h3>
				</div>
			</div>
			<div className="center" style={{ flexDirection: "column", paddingTop: "3rem" }}>
				<h3 style={{ marginBottom: "1rem" }}>This account doesn't exist lol</h3>
				<p>Try searching for another.</p>
			</div>
		</>
	);
};

export default NotFound;
