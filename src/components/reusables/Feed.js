import React, { useEffect, useState, lazy, Suspense } from "react";
import LoaderContainer from "./LoaderContainer";

import Tweet from "./Tweet";
const Toast = lazy(() => import("./Toast"));

const Feed = (props) => {
	const { tweetDatas, getReplies } = props;

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

	useEffect(() => {
		const sortedTweets = tweetDatas.sort((a, b) => (b.timeStamp.seconds - a.timeStamp.seconds));

		//tweet has been replied to. Don't let it come through again.

		const tweets = sortedTweets.map((tweet) => {
			console.log(tweet.text)
			console.log(tweet.timeStamp.toDate())
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
					checkReply={checkReply}
				/>
			);
		});

		
		setUniqueTweets(tweets);
	}, [tweetDatas, getReplies]);

	// remove the reply duplicates
	useEffect(() => {
		setUniqueTweets((t) => t.filter((tweet) => !doomedTweets.includes(tweet.props.tweetID)));
	}, [doomedTweets]);

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
