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
		db.collection("tweets")
			.orderBy("timeStamp", "desc")
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas(tempArray);
			});
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
