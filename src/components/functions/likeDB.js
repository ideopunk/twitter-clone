import { db } from "../../config/fbConfig";
import notify from "./notify";

const likeDB = (tweet, userID, userLikes) => {
	const newList = [...userLikes, tweet];

	db.collection("tweets")
		.doc(tweet)
		.get()
		.then((snapshot) => {
			// uhh side effect!
			if (userID !== snapshot.data().userID) {
				notify("like", userID, snapshot.data().userID, tweet);
			}

			const likes = snapshot.data().likes;
			const newLikes = [...(likes || []), userID];
			db.collection("tweets")
				.doc(tweet)
				.update({ likes: newLikes })
				.then(() => {
					console.log(`added to tweet's likes`);
				});

			db.collection("users")
				.doc(userID)
				.update({ likes: newList })
				.then(() => console.log("added to user's likes"));
		})
		.catch((err) => console.log(err));
};

export default likeDB;
