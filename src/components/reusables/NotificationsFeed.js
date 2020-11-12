import React, { useEffect, useState, useContext } from "react";
import { auth, db, storage } from "../../config/fbConfig";

import Leaf from "../../assets/leaf-outline.svg";
import { ReactComponent as LikeFilled } from "../../assets/like-icon-filled.svg";
import { ReactComponent as ProfileFilled } from "../../assets/profile-filled.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";

import notify from "../functions/notify";
import UserContext from "../context/context.js";
import LoaderContainer from "../reusables/LoaderContainer";
import Tweet from "./Tweet";

const NotificationsFeed = ({ notifications }) => {
	const [notificationsMapped, setNotificationsMapped] = useState([]);

	useEffect(() => {
		setNotificationsMapped([]);
		notifications.forEach((notification) => {
			let thingy;
			const { type, subject, object } = notification;
			console.log(notification);
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
										<div className="account-card" key={doc.id}>
											<ProfileFilled style={{ fill: "blue" }} />
											<div>
												<img
													src={image}
													alt="headshot"
													className="profile-image"
												/>
												<p>
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
												<div className="account-card" key={doc.id}>
													<Retweet style={{ fill: "blue" }} />
													<div>
														<img
															src={image}
															alt="headshot"
															className="profile-image"
														/>
														<p>
															{likerData.at} Retweeted your{" "}
															{"replyTo" in data ? "reply" : "tweet"}{" "}
														</p>
														<p className="grey">{data.text}</p>
													</div>
												</div>,
											]);
										});
								});
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
									key={doc.id}
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
								/>,
							]);
						});
					break;

				case "like":
					db.collection("tweets")
						.doc(object)
						.get()
						.then((doc) => {
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
												<div className="account-card" key={doc.id}>
													<LikeFilled />
													<div>
														<img
															src={image}
															alt="headshot"
															className="profile-image"
														/>
														<p>
															{likerData.at} liked your{" "}
															{"replyTo" in data ? "reply" : "tweet"}{" "}
														</p>
														<p className="grey">{data.text}</p>
													</div>
												</div>,
											]);
										});
								});
						});

					break;
				default:
					console.log("what?");
			}
		});
	}, [notifications]);

	return (
		<div className="feed">
			{notificationsMapped.length ? notificationsMapped : <LoaderContainer />}
		</div>
	);
};

export default NotificationsFeed;
