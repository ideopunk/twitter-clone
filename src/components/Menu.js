import React, { useState, useContext, useEffect } from "react";
import { NavLink, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Composer from "./reusables/Composer";
import Cover from "./reusables/Cover";
import UserContext from "./context/context.js";

import fish from "../assets/fish-outline.svg";
import { ReactComponent as HomeOutlineIcon } from "../assets/home-outline.svg";
import { ReactComponent as HomeFilled } from "../assets/home-filled.svg";
import { ReactComponent as ExploreIcon } from "../assets/explore-outline.svg";
import { ReactComponent as NotificationsFilled } from "../assets/notifications-filled.svg";
import { ReactComponent as NotificationsIcon } from "../assets/notifications-outline.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile-outline.svg";
import { ReactComponent as ProfileFilled } from "../assets/profile-filled.svg";
import { ReactComponent as MoreIcon } from "../assets/more-outline.svg";
import { ReactComponent as PowerIcon } from "../assets/power-outline.svg";

const Menu = (props) => {
	const { userName, userAt, userID, userImage } = useContext(UserContext);
	const [homeNotice, setHomeNotice] = useState(0);
	const [unseenNotes, setUnseenNotes] = useState(0);

	const [composer, setComposer] = useState(false);
	const [dropdown, setDropdown] = useState(false);

	let history = useHistory();
	let location = useLocation();

	// new home tweets watch
	useEffect(() => {
		console.log("use effect menu");
		const unsub = db
			.collection("users")
			.where("followers", "array-contains", userID || 0)
			.onSnapshot((snapshot) => {
				console.log("snapshot");
				let tempAmount = 0;

				snapshot.forEach((doc) => {
					const data = doc.data();
					tempAmount = tempAmount + data.tweets.length;
				});

				console.log(tempAmount);

				// if this is the first mount, set amount to 1.
				// if new amount isn't 0 and isn't same as old amount, update to new amount.
				setHomeNotice((t) => (t !== tempAmount && t !== 0 ? tempAmount : 1));
			});

		return () => unsub();
	}, [userID]);

	// notifications watch
	useEffect(() => {
		const unsub = db
			.collection("users")
			.doc(userID || "fake")
			.onSnapshot((doc) => {
				const data = doc.data();

				if (data && data.notifications) {
					const newLength = data.notifications.filter(
						(notification) => !notification.seen
					).length;
					setUnseenNotes((oldLength) => oldLength !== newLength && newLength);
				}
			});

		return () => unsub();
	}, [userID]);

	// freeze if modal up
	useEffect(() => {
		if (dropdown || composer) {
			document.body.style.position = "fixed";
		} else {
			document.body.style.position = "";
		}
	}, [composer, dropdown]);

	const signOut = () => {
		auth.signOut().then(() => {
			console.log("user signed out");
		});
		history.push("/explore");
	};

	const toggleComposer = () => {
		setDropdown(false);
		setComposer(!composer);
	};

	const toggleDropdown = () => {
		setComposer(false);
		setDropdown(!dropdown);
	};
	return (
		<>
			<ul className="menu">
				<li onClick={() => setHomeNotice(1)}>
					<NavLink
						activeClassName="menu-item-active"
						to="/"
						exact={true}
						className="menu-item"
						style={{ width: "3.25rem" }}
					>
						<span className="menu-icon" style={{ margin: "0" }}>
							<img className="menu-logo" src={fish} alt="fish" />
						</span>
					</NavLink>
				</li>
				{userID && (
					<li onClick={() => setHomeNotice(1)}>
						<NavLink
							activeClassName="menu-item-active"
							to="/"
							exact={true}
							className="menu-item"
						>
							{location.pathname === "/" ? <HomeFilled /> : <HomeOutlineIcon />}
							{homeNotice > 1 ? <div className="home-notice" /> : ""}
							<span className="menu-item-text">Home</span>
						</NavLink>
					</li>
				)}
				<li>
					<NavLink activeClassName="menu-item-active" to="/explore" className="menu-item">
						<ExploreIcon />
						<span className="menu-item-text">Explore</span>
					</NavLink>
				</li>
				{userID && (
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to="/notifications"
							className="menu-item"
							style={{ position: "relative" }}
						>
							{location.pathname === "/notifications" ? (
								<NotificationsFilled />
							) : (
								<NotificationsIcon />
							)}
							{unseenNotes ? <div className="pseudo">{unseenNotes}</div> : ""}
							<span className="menu-item-text">Notifications</span>
						</NavLink>
					</li>
				)}
				{userID && (
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to={`/${userAt}`}
							className="menu-item"
						>
							{location.pathname.length > 1 &&
							location.pathname !== "/notifications" &&
							location.pathname !== "/explore" ? (
								<ProfileFilled />
							) : (
								<ProfileIcon />
							)}
							<span className="menu-item-text">Profile</span>
						</NavLink>
					</li>
				)}
				{userID && (
					<li>
						<div className="menu-item" onClick={toggleDropdown}>
							<MoreIcon />
							<span className="menu-item-text">More</span>
						</div>
					</li>
				)}
				<li>
					<button
						className="btn"
						onClick={toggleComposer}
						style={{ marginBottom: "0.75rem" }}
					>
						Tweet
					</button>
				</li>
				{userID && (
					<li style={{ marginTop: "auto" }}>
						<button className="menu-profile-button" onClick={signOut}>
							<img src={userImage} alt="user-profile" className="profile-image" />
							<div className="menu-profile-button-text">
								<p>{userName}</p>
								<p className="grey">@{userAt}</p>
							</div>
							<PowerIcon className="menu-icon power-button" />
						</button>
					</li>
				)}
			</ul>
			{composer && (
				<Cover toggle={toggleComposer}>
					<Composer modal={true} toggle={toggleComposer} />
				</Cover>
			)}
			{dropdown && (
				<Cover toggle={toggleDropdown}>
					<Dropdown />
				</Cover>
			)}
		</>
	);
};

const Dropdown = () => {
	const { userID } = useContext(UserContext);

	const deleteAccount = (userID) => {
		import("./functions/deleteAccount.js").then((deleteTweet) => deleteTweet.default(userID));
	};

	return (
		<form className="modal pad">
			<h3 className="pad warning">
				Would you like to delete your account and all of your tweets? Replies to your tweets
				will not be deleted.
			</h3>
			<input
				className="btn"
				type="submit"
				value="Sure, delete my account!"
				style={{ marginTop: "auto" }}
				onClick={() => deleteAccount(userID)}
			/>
		</form>
	);
};

export default Menu;
