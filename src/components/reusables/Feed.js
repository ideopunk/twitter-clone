import React, { useEffect, useState } from "react";

import Tweet from "./Tweet";

const Feed = (props) => {
	const { tweetDatas, getReplies } = props;

	const [uniqueTweets, setUniqueTweets] = useState([]);

	useEffect(() => {
		let IDs = [];
		let tempUniqueTweets = [];

		for (let tweet of tweetDatas) {
			if (tweet.change === "modified") {
				console.log(tweet.change);
				tempUniqueTweets.push(tweet);
				IDs.push(tweet.id);
			}
		}

		console.log("only modifieds");
		console.log(tempUniqueTweets);
		console.log(IDs);

		for (let tweet of tweetDatas) {
			if (!IDs.includes(tweet.id)) {
				tempUniqueTweets.push(tweet);
				IDs.push(tweet.id);
			}
		}

		console.log("all");
		console.log(tempUniqueTweets);
		console.log(IDs);

		const sortedTweets = tempUniqueTweets.sort(
			(a, b) => (b.timeStamp.seconds = a.timeStamp.seconds)
		);

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
				/>
			);
		});

		setUniqueTweets(tweets);
	}, [tweetDatas, getReplies]);

	return <div className="feed">{uniqueTweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile.
