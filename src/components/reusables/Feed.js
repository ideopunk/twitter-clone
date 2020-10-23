import React from "react";
import Tweet from "./Tweet";

const Feed = (props) => {
	const { tweetDatas } = props;

	const tweets = tweetDatas.map((tweet) => {
		console.log(tweet);
		return (
			<Tweet
				key={tweet.id}
				userID={tweet.userID}
				image={tweet.pic}
				name={tweet.name}
				at={tweet.at}
				time={tweet.timeStamp}
				text={tweet.text}
				retweets={tweet.retweets}
				likes={tweet.likes}
			/>
		);
	});

	return (
		<div className="feed">
			{tweets}
		</div>
	);
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
