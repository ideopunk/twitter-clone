import { db } from "../../config/fbConfig";

const notify = (type, userID, personID, objectID) => {
	const userRef = db.collection("users").doc(personID);

	userRef.get().then((doc) => {
		const data = doc.data();
		const oldCheckedNotes =
			data.notifications.filter(
				(
					note // don't allow duplicates
				) => !(note.type === type && note.subject === userID && note.object === objectID)
			) || [];
		userRef.update({
			notifications: [
				...oldCheckedNotes,
				{
					type: type,
					subject: userID,
					object: objectID || "",
					timeStamp: new Date(),
					seen: false,
				},
			],
		});
	});
};

export default notify;
