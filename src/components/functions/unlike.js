import { db } from "../../config/fbConfig";

const unlike = (doomedTweet, userID, userLikes) => {
	db.collection("tweets")
		.doc(doomedTweet)
		.get()
		.then((snapshot) => {
			return snapshot.data().likes;
		})
		.then((likes) => {
			return likes.filter((aLike) => aLike !== userID);
		})
		.then((newLikes) => db.collection("tweets").doc(doomedTweet).update({ likes: newLikes }))
		.then(() => console.log("tweet loses a like"));

	const newList = userLikes.filter((likedTweet) => likedTweet !== doomedTweet);
	db.collection("users")
		.doc(userID)
		.update({ likes: newList })
		.then(() => console.log("user loses a like"));
};

export default unlike;
