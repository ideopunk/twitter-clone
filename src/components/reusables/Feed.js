import React, { useContext } from "react";
import { db } from "../../config/fbConfig";

import Tweet from "./Tweet";
import UserContext from "../context/context.js";

const Feed = (props) => {
	const { tweetDatas } = props;
	const { userID, userTweets } = useContext(UserContext);

	// putting this one level up from the tweets so each tweet isn't getting passed an array of all tweets.
	const deleteTweet = (e) => {
		const doomedTweet = e.target.getAttribute("value")
		const newList = userTweets.filter((tweet) => tweet !== doomedTweet);
		db.collection("users")
			.doc(userID)
			.update({ tweets: newList })
			.then(() => db.collection("tweets").doc(doomedTweet).delete())
			.then(() => console.log("deleted"));
	};

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
				deleteTweet={deleteTweet}
			/>
		);
	});

	return <div className="feed">{tweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
