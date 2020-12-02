import { db } from "../../config/fbConfig";

const unRetweet = (tweetID, userID) => {
	// remove from tweet's retweets
	const tweetRef = db.collection("tweets").doc(tweetID);

	tweetRef.get().then((doc) => {
		const data = doc.data();
		const newRetweets = data.retweets.filter((tweet) => tweet !== userID);
		tweetRef
			.update({ retweets: newRetweets })
			.then(() => console.log("removed from user's retweets"));

		// amend notifications
		const notificationRef = db.collection("users").doc(data.userID);
		notificationRef.get().then((doc) => {
			const data = doc.data();
			userRef.update({
				notifications: data.notifications.filter(
					(notification) =>
						notification.type !== "like" || notification.object !== tweetID
				),
			});
		});
	});

	// remove from user's retweets
	const userRef = db.collection("users").doc(userID);

	userRef.get().then((doc) => {
		const data = doc.data();
		userRef
			.update({ retweets: data.retweets.filter((tweet) => tweet !== tweetID) })
			.then(() => console.log("removed from user's retweets"));
	});
};

export default unRetweet;
