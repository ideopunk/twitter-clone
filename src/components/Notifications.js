import React, { useEffect, useState, useContext } from "react";
import DeviceContext from "./context/deviceContext.js";
import { db } from "../config/fbConfig";
import UserContext from "./context/userContext.js";
import NotificationsFeed from "./reusables/NotificationsFeed";
import MobileProfileLink from "./reusables/MobileProfileLink";

const Notifications = () => {
	const { device } = useContext(DeviceContext);
	const { userID } = useContext(UserContext);

	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		document.title = "Notifications / Fake Twitter";
	}, []);

	useEffect(() => {
		const userRef = db.collection("users").doc(userID);
		setNotifications([]);
		const unsub = userRef.onSnapshot((doc) => {
			if (doc.data().notifications) {
				setNotifications(
					doc
						.data()
						.notifications
				);
			}
		});

		return () => unsub();
	}, [userID]);

	return (
		<div className="home center-feed">
			<h3 className="top-link">
				{device === "mobile" && <MobileProfileLink />}Notifications
			</h3>
			<NotificationsFeed notifications={notifications} />
		</div>
	);
};

export default Notifications;
