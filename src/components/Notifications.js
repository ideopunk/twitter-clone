import React, { useEffect, useState, useContext } from "react";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import NotificationsFeed from "./reusables/NotificationsFeed";

const Notifications = () => {
	const { userID } = useContext(UserContext);

	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		document.title = "Notifications / Fake Twitter";
	}, []);

	useEffect(() => {
		const userRef = db.collection("users").doc(userID);

		const unsub = userRef.onSnapshot((doc) => setNotifications(doc.data().notifications));

		return () => unsub();
	}, [userID]);

	return (
		<div className="home center-feed">
			<h3 className="home-title">Notifications</h3>
			<NotificationsFeed notifications={notifications} />
		</div>
	);
};

export default Notifications;
