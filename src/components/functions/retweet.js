import { db } from "../../config/fbConfig";

const retweet = (tweetID, userID, userRetweets) => {
	// add to tweet's retweets
	db.collection("tweets")
		.doc(tweetID)
		.get()
		.then((snapshot) => snapshot.data().retweets)
		.then((retweets) => [...retweets || [], userID])
		.then((newRetweets) =>
			db.collection("tweets").doc(tweetID).update({ retweets: newRetweets })
		)
		.then(() => console.log("added to tweet's retweets"));

	// add to user's retweets
	const newList = [...userRetweets, tweetID];
	db.collection("users")
		.doc(userID)
		.update({ retweets: newList })
		.then(() => console.log("added to user's retweets"));
};

export default retweet;
