import React, { useEffect, useState } from "react";
import Feed from "./Feed";
import LoaderContainer from "./LoaderContainer";
import { db } from "../../config/fbConfig";

const LikeFeed = (props) => {
	const { profileID, name } = props;
	const [tweetDatas, setTweetDatas] = useState([]);

	// set doc title
	useEffect(() => {
		document.title = `Tweets liked by ${name}`
	}, []);

	useEffect(() => {
		db.collection("tweets")
			.where("likes", "array-contains", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas(tempArray);
			});
	}, [profileID]);

	return tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />;
};

export default LikeFeed;
