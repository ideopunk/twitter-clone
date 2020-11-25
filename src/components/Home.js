import React, { useState, useEffect, useContext } from "react";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import LoaderContainer from "./reusables/LoaderContainer";

import Composer from "./reusables/Composer";
import Feed from "./reusables/Feed";

const Home = (props) => {
	const { userFollows } = useContext(UserContext);

	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Home / Fake Twitter";
	}, []);

	useEffect(() => {
		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					console.log(change.type);
					if (change.type === "removed") {
						deletionArray.push(change.doc.id);
					}
				});

				snapshot.forEach((doc) => {
					const data = doc.data();

					// don't include replies. And only include follows
					if (!data.replyTo && userFollows.includes(data.userID)) {
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
			<h3 className="home-title">Home</h3>
			<Composer />
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Home;
