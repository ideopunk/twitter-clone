import React from "react";
import Tweet from "./Tweet";
import headshot from "../../assets/headshot.png";

const Feed = (props) => {
	const { tweetDatas } = props;

	const tweets = tweetDatas.map((tweet) => {
		console.log(tweet);
		return (
			<Tweet
				key={tweet.id}
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
			<Tweet
				image={headshot}
				name="Conor"
				at={"@ideopunk"}
				time={{seconds: 1585008000}}
				text="This is a tweet! Woo!"
				retweets={4}
				likes={4}
			/>
			{tweets}
		</div>
	);
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
