import { db } from "../../config/fbConfig";

const updateName = (userID, name) => {
	// update tweets with user's new name

	db.collection("tweets")
		.where("userID", "==", userID)
		.get()
		.then((snapshot) => {
			snapshot.forEach((doc) => {
				db.collection("tweets").doc(doc.id).update({ name: name });
			});
		});
};

export default updateName;
