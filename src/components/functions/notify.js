import { db } from "../../config/fbConfig";

const notify = (type, userID, personID, objectID) => {
	const userRef = db.collection("users").doc(personID);

	userRef
		.get()
		.then((doc) => {
			const data = doc.data();
			return data.notifications;
		})
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...(oldNotes || []),
					{
						type: type,
						subject: userID,
						object: objectID,
						timeStamp: new Date(),
						seen: false,
					},
				],
			})
		);
};

export default notify;
