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

	// listen to  tweetdata
	useEffect(() => {
		setTweetDatas([]);
		const unsub = db
			.collection("tweets")
			.where("userID", "==", profileID)
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();
				changes.forEach((change) => {
					console.log(change);
					const doc = change.doc;
					console.log(change.type);
					if (change.type === "removed") {
						deletionArray.push(doc.id);
					}
				});

				snapshot.forEach((doc) => {
					// is this the media page? Then only show media!
					if (mediaOnly) {
						if (doc.data().imageCount) {
							tempArray.push({ ...doc.data(), id: doc.id });
						}

						// is this the replies page? Then include replies.
					} else if (repliesIncluded) {
						tempArray.push({ ...doc.data(), id: doc.id });

						// Is this the main page? Then don't show replies.
					} else if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas(tempArray.filter((doc) => !deletionArray.includes(doc.id)));
			});

		// listen to  retweets
		const retweetUnsub = db
			.collection("tweets")
			.where("retweets", "array-contains", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();
				changes.forEach((change) => {
					const doc = change.doc;
					console.log(doc.data().timeStamp);
					if (change.type === "removed") {
						deletionArray.push(doc.id);
					}
				});

				snapshot.forEach((doc) => {
					if (mediaOnly) {
						if (doc.data().imageCount) {
							tempArray.push({ ...doc.data(), id: doc.id });
						}
					} else {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});

				// get rid of duplicates??
				setTweetDatas((t) => {
					const IDs = tempArray.map((doc) => doc.id);
					console.log(IDs);
					console.log(t.length);
					const newT = t.filter((doc) => {
						console.log(doc.id);
						return !IDs.includes(doc.id);
					});
					console.log(newT.length);
					return [...newT, ...tempArray].filter(
						(doc) => !deletionArray.includes(doc.id) // for sure don't include deleted tweets!
					);
				});
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
