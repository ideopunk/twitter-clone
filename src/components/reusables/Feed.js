import React, { useEffect, useState } from "react";

import Tweet from "./Tweet";

const Feed = (props) => {
	const { tweetDatas, getReplies } = props;

	const [uniqueTweets, setUniqueTweets] = useState([]);

	useEffect(() => {
		const tweets = tweetDatas.map((tweet) => {
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
				/>
			);
		});
		console.log(tweets)
		
		// filter out repeats (such as with self-retweets)
		let IDs = [];
		let tempUniqueTweets = [];
		for (let tweet of tweets) {
			if (!IDs.includes(tweet.props.tweetID)) {
				tempUniqueTweets.push(tweet);
				IDs.push(tweet.props.tweetID);
			}
		}

		console.log(tempUniqueTweets)
		setUniqueTweets(tempUniqueTweets);
		// }
	}, [tweetDatas, getReplies]);

	return <div className="feed">{uniqueTweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile.
