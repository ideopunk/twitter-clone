import { db } from "../../config/fbConfig";

const unfollow = (doomedAccount, userID, userFollows) => {
	const userRef = db.collection("users").doc(doomedAccount);
	
	userRef.get().then((doc) => {
		const data = doc.data();
		const followers = data.followers;
		const newList = followers.filter((follower) => follower !== userID);
		userRef.update({
			followers: newList,
			notifications: data.notifications.filter(
				(notification) => notification.type !== "like" || notification.subject !== userID
			),
		}).then(() => console.log("removed from followers list"));
	});

	const newList = userFollows.filter((account) => account !== doomedAccount);
	db.collection("users")
		.doc(userID)
		.update({ follows: newList })
		.then(() => console.log("removed from follows list"));
};

export default unfollow;
