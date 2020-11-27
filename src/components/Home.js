import React, { useState, useEffect, useContext } from "react";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import LoaderContainer from "./reusables/LoaderContainer";

import Composer from "./reusables/Composer";
import Feed from "./reusables/Feed";

const Home = () => {
	const { userFollows } = useContext(UserContext);
	console.log(userFollows);
	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Home / Fake Twitter";
	}, []);

	useEffect(() => {
		console.log("home use effect");
		console.log("userfollowS: " + userFollows);
		console.log("we're ago");
		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				console.log("snapshot");
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					if (change.type === "removed") {
						deletionArray.push(change.doc.id);
					}
				});
				console.log("uh");
				snapshot.forEach((doc) => {
					const data = doc.data();

					// include non-replies from follows
					if (!data.replyTo && userFollows.includes(data.userID)) {
						tempArray.push({ ...doc.data(), id: doc.id });
						// include replies from follows if you also follow the original tweeter.
					} else if (userFollows.includes(data.replyUserID)) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas(
					tempArray
						.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
						.filter((doc) => !deletionArray.includes(doc.id))
				);
			});
		return () => unsub();
	}, [userFollows]);

	return (
		<div className="home center-feed">
			<h3 className="top-link">Home</h3>
			<Composer />
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Home;
