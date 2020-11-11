import React, { useEffect, useState, useContext } from "react";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import LoaderContainer from "./reusables/LoaderContainer";
import NotificationsFeed from "./reusables/NotificationsFeed";

const Notifications = () => {
	const { userID } = useContext(UserContext);

	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const userRef = db.collection("users").doc(userID);

		userRef.get().then((doc) => setNotifications(doc.data().notifications));
	}, [userID]);

	return (
		<div className="home center-feed">
			<h3 className="home-title">Notifications</h3>
			<NotificationsFeed notifications={notifications} />
		</div>
	);
};

export default Notifications;
