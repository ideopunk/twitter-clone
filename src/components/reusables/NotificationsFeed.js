import React, { useEffect, useState, useContext } from "react";
import { auth, db, storage } from "../../config/fbConfig";
import notify from "../functions/notify";
import UserContext from "../context/context.js";
import LoaderContainer from "../reusables/LoaderContainer";
import Tweet from "./Tweet";

const NotificationsFeed = ({ notifications }) => {
	const [notificationsMapped, setNotificationsMapped] = useState([]);

	useEffect(() => {
		notifications.forEach((notification) => {
			let thingy;
			const { type, subject, object } = notification;
			console.log(notification);
			switch (type) {
				case "follow":
					thingy = (
						<div>
							<h1>{notification}</h1>
						</div>
					);
					setNotificationsMapped(<div className="account-card">{thingy}</div>);

					break;
				case "retweet":
					thingy = <div>retweet</div>;
					setNotificationsMapped(<div className="account-card">{thingy}</div>);

					break;
				case "reply":
					thingy = <div>reply</div>;
					setNotificationsMapped(<div className="account-card">{thingy}</div>);

					break;
				case "like":
					db.collection("tweets")
						.doc(object)
						.get()
						.then((doc) => {
							const data = doc.data();
							setNotificationsMapped(
								<div className="account-card">
									<p>{data.at} liked your tweet</p>
									<p className="grey">{data.text}</p>
								</div>
							);
						});

					break;
				default:
					console.log("what?");
			}
		});
	}, [notifications]);

	return <div className="feed">{notificationsMapped}</div>;
};

export default NotificationsFeed;
