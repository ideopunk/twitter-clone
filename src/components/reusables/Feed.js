import React, { useContext } from "react";
import { db } from "../../config/fbConfig";

import Tweet from "./Tweet";
import UserContext from "../context/context.js";

const Feed = (props) => {
	const { tweetDatas } = props;
	const { userID, userTweets, userFollows, userLikes } = useContext(UserContext);

	// putting this one level up from the tweets so each tweet isn't getting passed an array of all tweets.
	const deleteTweet = (e) => {
		const doomedTweet = e.target.getAttribute("value");
		const newList = userTweets.filter((tweet) => tweet !== doomedTweet);
		db.collection("users")
			.doc(userID)
			.update({ tweets: newList })
			.then(() => db.collection("tweets").doc(doomedTweet).delete())
			.then(() => console.log("deleted"));
	};

	const followAccount = (e) => {
		const account = e.target.getAttribute("value");

		db.collection("users")
			.doc(account)
			.get()
			.then((snapshot) => {
				return snapshot.data().followers;
			})
			.then((followers) => {
				return [...followers || [], userID];
			})
			.then((newFollowers) => {
				console.log(newFollowers);
				db.collection("users").doc(account).update({ followers: newFollowers });
			})
			.then(() => console.log("added to followers list"));

		const newList = [...userFollows, account];

		db.collection("users")
			.doc(userID)
			.update({ follows: newList })
			.then(() => console.log("added to follows list"));
	};

	const unfollowAccount = (e) => {
		const doomedAccount = e.target.getAttribute("value");

		db.collection("users")
			.doc(doomedAccount)
			.get()
			.then((snapshot) => {
				return snapshot.data().followers;
			})
			.then((followers) => {
				return followers.filter((follower) => follower !== userID);
			})
			.then((newList) =>
				db.collection("users").doc(doomedAccount).update({ followers: newList })
			)
			.then(() => console.log("removed from followers list"));

		const newList = userFollows.filter((account) => account !== doomedAccount);
		db.collection("users")
			.doc(userID)
			.update({ follows: newList })
			.then(() => console.log("removed from follows list"));
	};

	const like = (e) => {
		const tweet = e.target.getAttribute("value") || e.target.parentNode.getAttribute("value");
		console.log(e.target);
		console.log(e.target.parentNode);
		db.collection("tweets")
			.doc(tweet)
			.get()
			.then((snapshot) => {
				return snapshot.data().likes;
			})
			.then((likes) => {
				return [...likes || [], userID];
			})
			.then((newLikes) => db.collection("tweets").doc(tweet).update({ likes: newLikes }))
			.then(() => console.log(`added to tweet's likes`));

		const newList = [...userLikes, tweet];
		db.collection("users")
			.doc(userID)
			.update({ likes: newList })
			.then(() => console.log("added to user's likes"));
	};

	const unlike = (e) => {
		const doomedTweet =
			e.target.getAttribute("value") || e.target.parentNode.getAttribute("value");

		db.collection("tweets")
			.doc(doomedTweet)
			.get()
			.then((snapshot) => {
				return snapshot.data().likes;
			})
			.then((likes) => {
				return likes.filter((aLike) => aLike !== userID);
			})
			.then((newLikes) =>
				db.collection("tweets").doc(doomedTweet).update({ likes: newLikes })
			)
			.then(() => console.log("tweet loses a like"));

		const newList = userLikes.filter((likedTweet) => likedTweet !== doomedTweet);
		db.collection("users")
			.doc(userID)
			.update({ likes: newList })
			.then(() => console.log("user loses a like"));
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
				followAccount={followAccount}
				unfollowAccount={unfollowAccount}
				like={like}
				unlike={unlike}
			/>
		);
	});

	return <div className="feed">{tweets}</div>;
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
