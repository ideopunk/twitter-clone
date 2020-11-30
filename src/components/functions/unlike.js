import { db } from "../../config/fbConfig";

const unlike = (doomedTweet, userID, userLikes) => {
	db.collection("tweets")
		.doc(doomedTweet)
		.get()
		.then((snapshot) => {
			const likes = snapshot.data().likes;
			const newLikes = likes.filter((aLike) => aLike !== userID);
			db.collection("tweets")
				.doc(doomedTweet)
				.update({ likes: newLikes })
				.then(() => console.log("tweet loses a like"))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));

	const newList = userLikes.filter((likedTweet) => likedTweet !== doomedTweet);
	db.collection("users")
		.doc(userID)
		.update({ likes: newList })
		.then(() => console.log("user loses a like"))
		.catch((err) => console.log(err));
};

export default unlike;
