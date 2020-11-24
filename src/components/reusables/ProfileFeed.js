import React, { useEffect, useState } from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import Feed from "./Feed";
import LoaderContainer from "./LoaderContainer";
import { db } from "../../config/fbConfig";

const ProfileFeed = (props) => {
	const { profileID, repliesIncluded, name, mediaOnly } = props;
	const [tweetDatas, setTweetDatas] = useState([]);

	const route = useRouteMatch();
	const params = useParams();
	// set doc title
	useEffect(() => {
		if (route.url.includes("with_replies")) {
			document.title = `Tweets with replies by ${name}`;
		} else {
			document.title = `${name} (${params.profile})`;
		}
	}, [name, params.profile, route.url]);

	useEffect(() => {
		console.log(tweetDatas);
	}, [tweetDatas]);

	// listen to  tweetdata
	useEffect(() => {
		setTweetDatas("");
		const unsub = db
			.collection("tweets")
			.where("userID", "==", profileID)
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();
				changes.forEach((change) => {
					const doc = change.doc;
					console.log(change.type)
					if (change.type === "removed") {
						deletionArray.push(doc.id);
					} else if (mediaOnly) {
						if (doc.data().imageCount) {
							tempArray.push({ ...doc.data(), id: doc.id });
						}
					} else if (repliesIncluded) {
						tempArray.push({ ...doc.data(), id: doc.id });
					} else if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas((t) =>
					[...t, ...tempArray]
						.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
						.filter((doc) => !deletionArray.includes(doc.id))
				);
			});

		// listen to  retweets
		const retweetUnsub = db
			.collection("tweets")
			.where("retweets", "array-contains", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.onSnapshot((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					console.log(doc.data().timeStamp);
					if (mediaOnly) {
						if (doc.data().imageCount) {
							tempArray.push({ ...doc.data(), id: doc.id });
						}
					} else {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas((t) =>
					// sort function ensures they're still in the right order when retweets are added
					[...t, ...tempArray].sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
				);
			});

		// unmount
		return () => {
			unsub();
			retweetUnsub();
		};
	}, [profileID, repliesIncluded, mediaOnly]);

	return tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />;
};

export default ProfileFeed;
