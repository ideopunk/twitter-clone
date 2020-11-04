import { db } from "../../config/fbConfig";

const deleteAccount = (accountID) => {
	// delete user's tweets
	let doomedArray = [];

	db.collection("tweets")
		.where("userID", "==", accountID)
		.get()
		.then((snapshot) =>
			snapshot.forEach(
				(doc) => db.collection("tweets").doc(doc.id).delete() // get each tweet and destroy it
			)
		);

	// delete user's likes
	db.collection("tweets")
		.where("likes", "array-contains", accountID)
		.get()
		.then((snapshot) =>
			snapshot.forEach((doc) => {
				const data = doc.data();
				const newLikes = data.likes.filter((like) => like !== accountID);
				db.collection("tweets").doc(doc.id).update({ likes: newLikes });
			})
		);

	// delete follows of user
	db.collection("users")
		.where("follows", "array-contains", accountID)
		.get()
		.then((snapshot) =>
			snapshot.forEach((user) => {
				const data = user.data();
				const newFollows = data.follows.filter((follow) => follow !== accountID);
				db.collection("users").doc(user.id).update({ follows: newFollows });
			})
		);

	// delete followers of user
	db.collection("users")
		.where("followers", "array-contains", accountID)
		.get()
		.then((snapshot) =>
			snapshot.forEach((user) => {
				const data = user.data();
				const newFollowers = data.followers.filter((follower) => follower !== accountID);
				db.collection("users").doc(user.id).update({ followers: newFollowers });
			})
		);

	// delete user
	db.collection("users").doc(accountID).delete();
};

export default deleteAccount;
