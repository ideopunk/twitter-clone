import React from "react";
import Tweet from "./Tweet";
import headshot from "../../assets/headshot.png";
const Feed = (props) => {
	// const { tweets } = [props];

	// const JSXtweets = tweets.map((tweet) => (
	// 	<Tweet image={tweet.pic} name={tweet.name} at={tweet.at} time={tweet.time} text={tweet.text} retweets={tweet.retweets} likes={tweet.likes}/>
	// ));

	return (
		<div className="feed">
			<Tweet
				image={headshot}
				name="Conor"
				at={"@ideopunk"}
				time="March 4"
				text="This is a tweet! Woo!"
				retweets={4}
				likes={4}
			/>
		</div>
	);
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
