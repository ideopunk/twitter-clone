import React, { useEffect, useState, useContext } from "react";
import { db, storage } from "../../config/fbConfig";
import { useLocation, useHistory } from "react-router-dom";

import Leaf from "../../assets/leaf-outline.svg";
import { ReactComponent as LikeFilled } from "../../assets/like-icon-filled.svg";
import { ReactComponent as ProfileFilled } from "../../assets/profile-filled.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";

import UserContext from "../context/userContext.js";
import LoaderContainer from "../reusables/LoaderContainer";
import Tweet from "./Tweet";

const NotificationsFeed = ({ notifications }) => {
	const location = useLocation();
	const history = useHistory();
	const { userID } = useContext(UserContext);

	const [notificationsMapped, setNotificationsMapped] = useState([]);
	const [sorted, setSorted] = useState(false);

	// the notifications have been observed. Update that so that the menu stops alerting us to new notifications.
	useEffect(() => {
		const userRef = db.collection("users").doc(userID);

		userRef.get().then((doc) => {
			const data = doc.data();
			const seenNotes = data.notifications
				? data.notifications.map((notification) => {
						let newNotification = notification;
						newNotification.seen = true;
						return newNotification;
				  })
				: [];
			userRef.update({ notifications: seenNotes });
		});
	}, [userID]);

	// display the notifications.
	useEffect(() => {
		setNotificationsMapped([]);

		let tempArray = [];
		notifications.forEach((notification) => {
			const { type, subject, object, timeStamp } = notification;
			if (!tempArray.includes(timeStamp.seconds)) {
				tempArray.push(timeStamp.seconds);
				switch (type) {
					case "follow":
						db.collection("users")
							.doc(subject)
							.get()
							.then((doc) => {
								const data = doc.data();
								storage
									.ref("profile_pictures/" + doc.id + ".png")
									.getDownloadURL()
									.then((url) => {
										throw url;
									})
									.catch((err) => {
										let image;
										if (err["code"]) {
											image = Leaf;
										} else {
											image = err;
										}
										setNotificationsMapped((n) => [
											...n,
											<div
												className="account-card appear"
												key={doc.id + "follow"}
												style={{ alignItems: "flex-start" }}
												data-timestamp={timeStamp.seconds}
												onClick={() =>
													history.push({
														pathname: `/${doc.id}`,
														state: {
															prevPath: location.pathname,
														},
													})
												}
											>
												<ProfileFilled
													style={{ fill: "blue" }}
													className="notification-icon"
												/>
												<div>
													<img
														src={image}
														alt="headshot"
														className="profile-image small-profile-image"
													/>
													<p style={{ marginTop: "0.5rem" }}>
														<span className="bold">{data.name}</span>{" "}
														followed you
													</p>
												</div>
											</div>,
										]);
									});
							});

						break;

					case "retweet":
						db.collection("tweets")
							.doc(object)
							.get()
							.then((doc) => {
								const data = doc.data();
								if (doc.exists) {
									db.collection("users")
										.doc(subject)
										.get()
										.then((liker) => {
											const likerData = liker.data();
											storage
												.ref("profile_pictures/" + subject + ".png")
												.getDownloadURL()
												.then((url) => {
													throw url;
												})

												.catch((err) => {
													let image;
													if (err["code"]) {
														image = Leaf;
													} else {
														image = err;
													}
													setNotificationsMapped((n) => [
														...n,
														<div
															className="account-card appear"
															key={doc.id + "retweet"}
															style={{ alignItems: "flex-start" }}
															data-timestamp={timeStamp.seconds}
															onClick={() =>
																history.push({
																	pathname: `/tweet/${doc.id}`,
																	state: {
																		prevPath: location.pathname,
																	},
																})
															}
														>
															<Retweet
																className="notification-icon"
																style={{ fill: "blue" }}
															/>
															<div>
																<img
																	src={image}
																	alt="headshot"
																	className="profile-image small-profile-image"
																/>
																<p style={{ marginTop: "0.5rem" }}>
																	<span className="bold">
																		{likerData.at}
																	</span>{" "}
																	Retweeted your{" "}
																	{"replyTo" in data
																		? "reply"
																		: "tweet"}{" "}
																</p>
																<p
																	className="grey"
																	style={{ marginTop: "0.5rem" }}
																>
																	{data.text}
																</p>
															</div>
														</div>,
													]);
												});
										});
								}
							});

						break;
					case "reply":
						db.collection("tweets")
							.doc(object)
							.get()
							.then((doc) => {
								const data = doc.data();
								setNotificationsMapped((n) => [
									...n,
									<Tweet
										key={doc.id + "reply"}
										tweetID={doc.id}
										tweeterID={data.userID}
										name={data.name}
										at={data.at}
										time={data.timeStamp}
										text={data.text}
										retweets={data.retweets}
										replyTo={data.replyTo}
										likes={data.likes}
										getReplies={false}
										replies={data.replies}
										imageCount={data.imageCount}
										data-timestamp={timeStamp.seconds}
									/>,
								]);
							});
						break;

					case "like":
						db.collection("tweets")
							.doc(object)
							.get()
							.then((doc) => {
								if (doc.exists) {
									const data = doc.data();
									db.collection("users")
										.doc(subject)
										.get()
										.then((liker) => {
											const likerData = liker.data();
											storage
												.ref("profile_pictures/" + subject + ".png")
												.getDownloadURL()
												.then((url) => {
													throw url;
												})

												.catch((err) => {
													let image;
													if (err["code"]) {
														image = Leaf;
													} else {
														image = err;
													}
													setNotificationsMapped((n) => [
														...n,
														<div
															className="account-card appear"
															data-timestamp={timeStamp.seconds}
															key={doc.id + "like"}
															style={{ alignItems: "flex-start" }}
															onClick={() =>
																history.push({
																	pathname: `/tweet/${object}`,
																	state: {
																		prevPath: location.pathname,
																	},
																})
															}
														>
															<LikeFilled
																className="notification-icon"
																style={{ fill: "red" }}
															/>
															<div>
																<img
																	src={image}
																	alt="headshot"
																	className="profile-image small-profile-image"
																/>
																<p style={{ marginTop: "0.5rem" }}>
																	<span className="bold">
																		{likerData.at}
																	</span>{" "}
																	liked your{" "}
																	{"replyTo" in data
																		? "reply"
																		: "tweet"}{" "}
																</p>
																<p
																	className="grey"
																	style={{ marginTop: "0.5rem" }}
																>
																	{data.text}
																</p>
															</div>
														</div>,
													]);
												});
										});
								}
							});

						break;
					default:
						console.log("what?");
				}
			}
		});
	}, [notifications, history, location.pathname]);

	useEffect(() => {
		console.log(notifications.length)
		console.log(notificationsMapped.length)
		if (notificationsMapped.length === notifications.length && notifications.length > 1 && !sorted) {
			console.log("lengths equivalent")
			setNotificationsMapped(
				notificationsMapped
					.sort((a, b) => {
						console.log(a)
						return b.props["data-timestamp"] - a.props["data-timestamp"];
					})
					.reverse()
			);
			setSorted(true);
		}
	}, [notifications, notificationsMapped, sorted]);

	return <div className="feed">{sorted ? notificationsMapped : <LoaderContainer />}</div>;
};

export default NotificationsFeed;
