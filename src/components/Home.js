import React, { useState, useEffect, useContext } from "react";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import LoaderContainer from "./reusables/LoaderContainer";

import Composer from "./reusables/Composer";
import Feed from "./reusables/Feed";

const Home = (props) => {
	const { userID } = useContext(UserContext);

	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Home / Fake Twitter";
	}, []);

	useEffect(() => {
		setTweetDatas([]);

		const unsub = db
			.collection("users")
			.where("followers", "array-contains", userID)
			.onSnapshot((snapshot) => {
				let tempArray = [];

				const changes = snapshot.docChanges();
				// for each user we follow...
				changes.forEach((change) => {
					const doc = change.doc;
					doc.data().tweets && tempArray.push(...doc.data().tweets);
				});

				// why won't you remove tweets that were deleted?
				db.collection("tweets")
					.orderBy("timeStamp", "desc")
					.get()
					.then((snapshot) => {
						let finalArray = [];
						snapshot.forEach((doc) => {
							if (tempArray.includes(doc.id) && !doc.data().replyTo) {
								finalArray.push({ ...doc.data(), id: doc.id });
							}
						});
						setTweetDatas((t) =>
							[...t, ...finalArray].sort(
								(a, b) => b.timeStamp.seconds - a.timeStamp.seconds
							)
						);
					});
			});

		return () => {
			unsub();
		};
	}, [userID]);

	return (
		<div className="home center-feed">
			<h3 className="home-title">Home</h3>
			<Composer />
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Home;
