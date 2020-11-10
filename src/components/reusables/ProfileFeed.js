import React, { useEffect, useState } from "react";
import Feed from "./Feed";
import LoaderContainer from "./LoaderContainer";
import { db } from "../../config/fbConfig";

const ProfileFeed = (props) => {
	const { profileID, repliesIncluded } = props;
	const [tweetDatas, setTweetDatas] = useState([]);

	// set tweetdata
	useEffect(() => {
		console.log("set tweetdata");
		db.collection("tweets")
			.where("userID", "==", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
                    console.log(repliesIncluded)
					if (repliesIncluded) {
						tempArray.push({ ...doc.data(), id: doc.id });
					} else {
						if (!doc.data().replyTo) {
							tempArray.push({ ...doc.data(), id: doc.id });
						}
					}
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas((t) => [...t, ...tempArray]);
			});

		// add retweets
		db.collection("tweets")
			.where("retweets", "array-contains", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					console.log(doc.data().timeStamp);
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas((t) =>
					// sort function ensures they're still in the right order when retweets are added
					[...t, ...tempArray].sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
				);
			});
	}, [profileID, repliesIncluded]);

	return tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />;
};

export default ProfileFeed;
