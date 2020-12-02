import { db } from "../../config/fbConfig";

const deleteTweet = (doomedTweet, userTweets, userID, replyTo) => {
	const newList = userTweets.filter((tweet) => tweet !== doomedTweet);

	// delete from user's tweets
	db.collection("users")
		.doc(userID)
		.update({ tweets: newList })
		.then(() => console.log("deleted"));

	// delete tweet doc itself
	db.collection("tweets").doc(doomedTweet).delete();

	// adjust retweets
	db.collection("users")
		.where("retweets", "array-contains", doomedTweet)
		.get()
		.then((snapshot) => {
			snapshot.forEach((user) => {
				const data = user.data();
				const newRetweets = data.retweets.filter((retweet) => retweet !== doomedTweet);
				user.update({ retweets: newRetweets });
			});
		});

	// adjust likes
	db.collection("users")
		.where("likes", "array-contains", doomedTweet)
		.get()
		.then((snapshot) => {
			snapshot.forEach((user) => {
				const data = user.data();
				const newLikes = data.likes.filter((like) => like !== doomedTweet);
				user.update({ likes: newLikes });
			});
		});

	// adjust original if a reply
	// and notifications
	if (replyTo) {
		const tweetRef = db.collection("tweets").doc(replyTo);
		tweetRef.get().then((doc) => {
			const data = doc.data();
			tweetRef.update({ replies: data.replies.filter((reply) => reply !== doomedTweet) });

			const userRef = db.collection("users").doc(doc.id);

			userRef.get().then((doc) => {
				const data = doc.data();
				userRef.update({
					notifications: data.notifications.filter(
						(notification) =>
							notification.object !== doomedTweet || notification.type !== "reply"
					),
				});
			});
		});
	}
};

export default deleteTweet;
