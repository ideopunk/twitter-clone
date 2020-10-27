import { db } from "../../config/fbConfig";

const unfollow = (e, userID, userFollows) => {
	const doomedAccount = e.target.getAttribute("value");

	db.collection("users")
		.doc(doomedAccount)
		.get()
		.then((snapshot) => {
			return snapshot.data().followers;
		})
		.then((followers) => {
			return followers.filter((follower) => follower !== userID);
		})
		.then((newList) => db.collection("users").doc(doomedAccount).update({ followers: newList }))
		.then(() => console.log("removed from followers list"));

	const newList = userFollows.filter((account) => account !== doomedAccount);
	db.collection("users")
		.doc(userID)
		.update({ follows: newList })
		.then(() => console.log("removed from follows list"));
};

export default unfollow;
