import React, { useEffect, useState, useContext } from "react";
import { auth, db, storage } from "../../config/fbConfig";
import notify from "../functions/notify";
import UserContext from "../context/context.js";
import LoaderContainer from "../reusables/LoaderContainer";
import Tweet from "./Tweet";

const NotificationsFeed = ({ notifications }) => {
	const notificationsMapped = notifications.map((notification) => {
		let thingy;
		switch (notification.type) {
			case "follow":
				thingy = (
					<div>
						<h1>{notification}</h1>
					</div>
				);
				break;
			case "retweet":
				thingy = <div>retweet</div>;

				break;
			case "reply":
				thingy = <div>reply</div>;

				break;
			case "like":
				thingy = <div>like</div>;
				break;
			default:
				console.log("what?");
		}
		return thingy;
	});

	return <div className="feed">{notificationsMapped}</div>;
};

export default NotificationsFeed;
