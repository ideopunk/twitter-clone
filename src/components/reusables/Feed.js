import React, { useEffect, useState, lazy, Suspense } from "react";
import LoaderContainer from "./LoaderContainer";

import Tweet from "./Tweet";
const Toast = lazy(() => import("./Toast"));

const Feed = (props) => {
	const { tweetDatas, getReplies } = props;

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

	useEffect(() => {
		const sortedTweets = tweetDatas.sort((a, b) => (b.timeStamp.seconds = a.timeStamp.seconds));

		const tweets = sortedTweets.map((tweet) => {
			return (
				<Tweet
					key={tweet.id}
					tweetID={tweet.id}
					tweeterID={tweet.userID}
					name={tweet.name}
					at={tweet.at}
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
				/>
			);
		});

		setUniqueTweets(tweets);
	}, [tweetDatas, getReplies]);

	return (
		<div className="feed">
			{uniqueTweets}
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
