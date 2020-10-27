import React, { useContext } from "react";
import { db } from "../../config/fbConfig";

import Tweet from "./Tweet";
import UserContext from "../context/context.js";

const Feed = (props) => {
	const { tweetDatas } = props;
	const { userID, userTweets, userFollows, userLikes } = useContext(UserContext);



	const tweets = tweetDatas.map((tweet) => {
		console.log(tweet);
		return (
			<Tweet
				key={tweet.id}
				tweetID={tweet.id}
				tweeterID={tweet.userID}
				userID={userID}
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

	return <div className="feed">{tweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
