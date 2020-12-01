import { db } from "../../config/fbConfig";
import notify from "./notify";

const follow = (followID, userID, userFollows) => {
	db.runTransaction((transaction) => {
		return db
			.collection("users")
			.doc(followID)
			.get()
			.then((snapshot) => {
				return snapshot.data().followers;
			})
			.then((followers) => {
				return [...(followers || []), userID];
			})
			.then((newFollowers) => {
				console.log(newFollowers);
				db.collection("users")
					.doc(followID)
					.update({ followers: [...new Set(newFollowers)] });
			})
			.then(() => {
				console.log("added to followers list");
				const newList = [...userFollows, followID];
				db.collection("users")
					.doc(userID)
					.update({ follows: [...new Set(newList)] })
					.then(() => console.log("added to follows list"))
					.then(() => {
						if (userID !== followID) {
							notify("follow", userID, followID, "");
						}
					});
			});
	})
		.then(() => console.log("successful transaction"))
		.catch((err) => {
			console.log(err);
			console.log("transaction failure");
		});
};

export default follow;
