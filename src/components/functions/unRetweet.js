import { db } from "../../config/fbConfig";

const unRetweet = (tweetID, userID) => {
	console.log("tweetID: " + tweetID);
	console.log("userID: " + userID);
	// remove from tweet's retweets
	db.collection("tweets")
		.doc(tweetID)
		.get()
		.then((snapshot) => {
			console.log(snapshot.data());
			return snapshot.data().retweets;
		})
		.then((retweets) => {
			return retweets.filter((tweet) => tweet !== userID);
		})
		.then((newRetweets) => {
			console.log(newRetweets);
			db.collection("tweets").doc(tweetID).update({ retweets: newRetweets });
		})
		.then(() => console.log("removed from user's retweets"));

	// remove from user's retweets
	db.collection("users")
		.doc(userID)
		.get()
		.then((snapshot) => snapshot.data().retweets)
		.then((retweets) => {
			console.log(retweets);
			return retweets.filter((tweet) => tweet !== tweetID);
		})
		.then((newList) => {
			console.log(newList);
			db.collection("users").doc(userID).update({ retweets: newList });
		})
		.then(() => console.log("removed from user's retweets"));
};

export default unRetweet;
