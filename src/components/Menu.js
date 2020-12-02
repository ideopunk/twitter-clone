import React, { useState, useContext, useEffect } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Composer from "./reusables/Composer";
import Cover from "./reusables/Cover";
import UserContext from "./context/userContext.js";
import DeviceContext from "./context/deviceContext.js";

import { ReactComponent as Fish } from "../assets/fish.svg";
import { ReactComponent as HomeOutlineIcon } from "../assets/home-outline.svg";
import { ReactComponent as HomeFilled } from "../assets/home-filled.svg";
import { ReactComponent as ExploreIcon } from "../assets/explore-outline.svg";
import { ReactComponent as NotificationsFilled } from "../assets/notifications-filled.svg";
import { ReactComponent as NotificationsIcon } from "../assets/notifications-outline.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile-outline.svg";
import { ReactComponent as ProfileFilled } from "../assets/profile-filled.svg";
import { ReactComponent as MoreIcon } from "../assets/more-outline.svg";
import { ReactComponent as PowerIcon } from "../assets/power-outline.svg";
import { ReactComponent as ComposerIcon } from "../assets/composer-icon.svg";

const Menu = () => {
	const { userName, userAt, userID, userImage } = useContext(UserContext);
	const { device } = useContext(DeviceContext);

	const [homeNotice, setHomeNotice] = useState(false);
	// eslint-disable-next-line
	const [amount, setAmount] = useState(0);
	const [unseenNotes, setUnseenNotes] = useState(0);

	const [composer, setComposer] = useState(false);
	const [dropdown, setDropdown] = useState(false);

	let history = useHistory();
	let location = useLocation();

	useEffect(() => {
		if (location.pathname === "/" && window.scrollY === 0 && homeNotice === true) {
			setHomeNotice(false);
		}
	}, [location, homeNotice]);

	// new home tweets watch
	useEffect(() => {
		const unsub = db
			.collection("users")
			.where("followers", "array-contains", userID || 0)
			.onSnapshot((snapshot) => {
				let tempAmount = 0;

				snapshot.forEach((doc) => {
					const data = doc.data();
					tempAmount += data.tweets.length;
				});

				setAmount((t) => {
					if (t < tempAmount) {
						// side effect!!!
						setHomeNotice(true);
						return tempAmount;
					}
				});
			});

		return () => unsub();
	}, [userID]);

	// notifications watch
	useEffect(() => {
		const unsub = db
			.collection("users")
			.doc(String(userID) || "fake")
			.onSnapshot((doc) => {
				const data = doc.data();

				if (data && data.notifications) {
					const newLength = data.notifications.filter(
						(notification) => !notification.seen
					).length;
					setUnseenNotes(newLength);
				}
			});

		return () => unsub();
	}, [userID]);

	// freeze if modal up
	useEffect(() => {
		const body = document.body;
		const scroll = window.scrollY;

		if (dropdown || composer) {
			body.style.position = "fixed";
			body.style.top = `-${scroll}px`;
		} else {
			body.style.position = "";
			window.scrollTo(0, -parseInt(body.style.top));
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
				{device !== "mobile" && (
					<li
						onClick={() => {
							window.scrollY = 0;
							setHomeNotice(false);
						}}
					>
						<NavLink
							activeClassName="menu-item-active"
							to="/"
							exact={true}
							className="menu-item"
							style={{ width: "3.25rem" }}
						>
							<span className="menu-icon" style={{ margin: "0" }}>
								<Fish />
							</span>
						</NavLink>
					</li>
				)}
				{userID !== -1 && (
					<li
						onClick={() => {
							window.scrollY = 0;

							setHomeNotice(false);
						}}
					>
						<NavLink
							activeClassName="menu-item-active"
							to="/"
							exact={true}
							className="menu-item"
						>
							{location.pathname === "/" ? <HomeFilled /> : <HomeOutlineIcon />}
							{homeNotice ? <div className="home-notice" /> : ""}
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
				{userID !== -1 && (
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
				{device !== "mobile" && userID !== -1 && (
					<li>
						<NavLink
							activeClassName="menu-item-active"
							to={`/${userAt}`}
							className="menu-item"
						>
							{location.pathname.length > 1 &&
							location.pathname !== "/notifications" &&
							!location.pathname.includes("tweet") &&
							location.pathname !== "/explore" ? (
								<ProfileFilled />
							) : (
								<ProfileIcon />
							)}
							<span className="menu-item-text">Profile</span>
						</NavLink>
					</li>
				)}
				{userID !== -1 && device !== "mobile" && (
					<li>
						<div className="menu-item" onClick={toggleDropdown}>
							<MoreIcon />
							<span className="menu-item-text">More</span>
						</div>
					</li>
				)}
				<li className="tweet-li">
					{device === "comp" ? (
						<button
							className="btn"
							onClick={toggleComposer}
							style={{ marginBottom: "0.75rem" }}
						>
							Tweet
						</button>
					) : (
						<ComposerIcon
							style={{
								margin: "0",
								fill: "white",
							}}
							onClick={toggleComposer}
						/>
					)}
				</li>
				{userID !== -1 && (
					<li style={{ marginTop: device !== "mobile" ? "auto" : "" }}>
						<button className="menu-profile-button" onClick={signOut}>
							{device === "comp" && (
								<>
									<img
										src={userImage || ""}
										alt="user-profile"
										className={`profile-image ${
											userImage ? "" : "transparent"
										}`}
									/>
									<div className="menu-profile-button-text">
										<p>{userName}</p>
										<p className="grey">@{userAt}</p>
									</div>
								</>
							)}
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
