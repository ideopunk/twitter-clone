import { db } from "../../config/fbConfig";

const deleteTweet = (doomedTweet, userTweets, userID) => {
	const newList = userTweets.filter((tweet) => tweet !== doomedTweet);
	db.collection("users")
		.doc(userID)
		.update({ tweets: newList })
		.then(() => db.collection("tweets").doc(doomedTweet).delete())
		.then(() => console.log("deleted"));

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
            user.update({ likes: newLikes});
        });
    });
};

export default deleteTweet;
