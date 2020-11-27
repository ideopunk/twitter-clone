import React, { useEffect, useState } from "react";
import { db } from "../config/fbConfig";
import Feed from "./reusables/Feed";
import LoaderContainer from "./reusables/LoaderContainer";
import Search from "./reusables/Search";

const Explore = () => {
	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Explore / Fake Twitter";
	}, []);

	useEffect(() => {
		console.log("explore use effect")

		setTweetDatas([]);

		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					console.log(change.type);
					const doc = change.doc;

					if (change.type === "removed") {
						deletionArray.push(doc.id);
					}
				});

				// don't include replies
				snapshot.forEach((doc) => {
					if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});

				setTweetDatas(tempArray.filter((doc) => !deletionArray.includes(doc.id)));
			});

		return () => unsub();
	}, []);

	return (
		<div className="explore center-feed">
			<div className="pad top-link">
				<Search className="pad" />
			</div>
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Explore;
