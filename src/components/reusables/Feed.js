import React, { useEffect, useState, useContext, lazy, Suspense } from "react";
import LoaderContainer from "./LoaderContainer";
import { storage } from "../../config/fbConfig";
import Leaf from "../../assets/leaf-outline.svg";
import UserContext from "../context/userContext.js";

import Tweet from "./Tweet";
const Toast = lazy(() => import("./Toast"));

const Feed = (props) => {
	const { tweetDatas, getReplies, noOriginal } = props;
	const { userID, userImage } = useContext(UserContext);

	const [uniqueTweets, setUniqueTweets] = useState([]);
	const [deleteToast, setDeleteToast] = useState(false);

	// toasts last one second.
	useEffect(() => {
		let timer = null;
		if (deleteToast) {
			timer = setTimeout(() => {
				setDeleteToast(false);
			}, 1000);
		}

		return () => clearTimeout(timer);
	}, [deleteToast]);

	// this saves the app from requesting the url from storage for each tweet.
	useEffect(() => {
		let finalImages = [];

		// now that we have the images, make the components
		const makeComponents = () => {
			const sortedTweets = tweetDatas.sort(
				(a, b) => b.timeStamp.seconds - a.timeStamp.seconds
			);

			// if the tweet's replies include another tweet in the feed, don't include the tweet,
			// it's going to be generated by the repliedTo tweet as its 'original tweet' anyway.
			const filteredTweets = sortedTweets.filter((tweet) => {
				let status = true;
				if (tweet.replies) {
					status = tweet.replies.some(
						(reply) => !sortedTweets.map((tweet) => tweet.id).includes(reply)
					);
				}
				return status;
			});

			const tweets = filteredTweets.map((tweet) => {
				const image = finalImages.filter((image) => image.id === tweet.userID);
				return (
					<Tweet
						key={tweet.id}
						tweetID={tweet.id}
						tweeterID={tweet.userID}
						name={tweet.name}
						at={tweet.at}
						image={image[0]["image"]}
						time={tweet.timeStamp}
						text={tweet.text}
						retweets={tweet.retweets}
						replyTo={tweet.replyTo}
						likes={tweet.likes}
						getReplies={getReplies}
						replies={tweet.replies}
						imageCount={tweet.imageCount}
						change={tweet.change}
						deleteToast={setDeleteToast}
						noOriginal={noOriginal}
					/>
				);
			});
			console.log(tweets);
			setUniqueTweets(tweets);
		};

		const check = (a, b) => {
			if (a.length === b.length) {
				console.log("a length equals b length");
				finalImages.push(...b);
				makeComponents();
			}
		};

		// do we have the ingredients and haven't done this yet? Get the images.
		if (userID && userImage && tweetDatas.length && !finalImages.length) {
			const tweeterIDs = tweetDatas.map((tweet) => {
				return tweet.userID;
			});
			const uniqueTweeterIDs = [...new Set(tweeterIDs)];

			let tweeterImages = [];
			for (let tweeterID of uniqueTweeterIDs) {
				if (tweeterID === userID) {
					tweeterImages.push({ id: tweeterID, image: userImage });
					check(uniqueTweeterIDs, tweeterImages);
				} else {
					storage
						.ref("profile_pictures/" + tweeterID + ".png")
						.getDownloadURL()
						.then((url) => {
							tweeterImages.push({ id: tweeterID, image: url });
							check(uniqueTweeterIDs, tweeterImages);
						})
						.catch((err) => {
							console.log(err);
							tweeterImages.push({ id: tweeterID, image: Leaf });
							check(uniqueTweeterIDs, tweeterImages);
						});
				}
			}
		}
	}, [tweetDatas, userID, userImage, getReplies, noOriginal]);

	return (
		<div className="feed">
			{uniqueTweets.length > 0 ? uniqueTweets : <LoaderContainer />}
			{deleteToast ? (
				<Suspense fallback={<LoaderContainer />}>
					<Toast message="Your Tweet was deleted wahh" />
				</Suspense>
			) : (
				""
			)}
		</div>
	);
};

export default Feed;

// used in Home, Explore, Profile.
