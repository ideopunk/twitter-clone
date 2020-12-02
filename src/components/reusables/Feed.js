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
	const [doomedTweets, setDoomedTweets] = useState([]);

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

	const checkReply = (id) => {
		setDoomedTweets((doom) => [...doom, id]);
	};

	// this saves the app from requesting the url from storage for each tweet.
	useEffect(() => {
		let finalImages = [];

		// now that we have the images, make the components
		const makeComponents = () => {
			console.log("make the components");
			const sortedTweets = tweetDatas.sort(
				(a, b) => b.timeStamp.seconds - a.timeStamp.seconds
			);

			console.log(sortedTweets.length);
			const tweets = sortedTweets.map((tweet) => {
				console.log(tweet.at, tweet.text, tweet.userID);
				console.log(finalImages);
				console.log(finalImages[0]);
				const image = finalImages.filter((image) => {
					console.log(image.id);
					console.log(tweet.userID);
					return image.id === tweet.userID;
				});
				console.log(image[0]);
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
						checkReply={checkReply}
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
			console.log("image object array use effect");
			const tweeterIDs = tweetDatas.map((tweet) => {
				console.log(tweet.text);
				return tweet.userID;
			});
			const uniqueTweeterIDs = [...new Set(tweeterIDs)];

			console.log(tweetDatas.length);
			console.log(tweeterIDs);
			console.log(uniqueTweeterIDs);

			let tweeterImages = [];
			for (let tweeterID of uniqueTweeterIDs) {
				if (tweeterID === userID) {
					console.log("userID");
					tweeterImages.push({ id: tweeterID, image: userImage });
					check(uniqueTweeterIDs, tweeterImages);
				} else {
					console.log("non-userID");
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

	// remove the reply duplicates
	useEffect(() => {
		console.log("remove reply duplicates use effect");
		setUniqueTweets((t) =>
			t
				.filter((tweet) => !doomedTweets.includes(tweet.props.tweetID))
				.sort((a, b) => b.props.time.seconds - a.props.time.seconds)
		);
	}, [doomedTweets]);

	//

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
