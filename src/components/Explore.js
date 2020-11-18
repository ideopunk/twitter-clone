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
		setTweetDatas([]);
		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					const doc = change.doc;

					// don't include replies
					if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas((t) =>
					[...t, ...tempArray].sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
				);
			});

		return () => unsub();
	}, []);

	return (
		<div className="explore center-feed">
			<div className="pad side-box-title">
				<Search className="pad" />
			</div>
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Explore;
