import { db } from "../../config/fbConfig";

const unRetweet = (tweetID, userID) => {
	// remove from tweet's retweets
	db.collection("tweets")
		.doc(tweetID)
		.get()
		.then((snapshot) => snapshot.data().retweets)
		.then((retweets) => retweets.filter((tweet) => tweet.userID !== userID))
		.then((newRetweets) =>
			db.collection("tweets").doc(tweetID).update({ retweets: newRetweets })
		)
		.then(() => console.log("removed from user's retweets"));

	// remove from user's retweets
	db.collection("users")
		.doc(userID)
		.get()
		.then((snapshot) => snapshot.data().retweets)
		.then((retweets) => retweets.filter((tweet) => tweet.id !== tweetID))
		.then((newList) => db.collection("users").doc(userID).update({ retweets: newList }))
		.then(() => console.log("removed from user's retweets"));
};

export default unRetweet;
