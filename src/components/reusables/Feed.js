import React from "react";

import Tweet from "./Tweet";

const Feed = (props) => {
	const { tweetDatas, getReplies } = props;


	const tweets = tweetDatas.map((tweet) => {
		console.log(tweet);
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

	return <div className="feed">{tweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
