import { db } from "../../config/fbConfig";

const followNotify = (userID, followID) => {
	const userRef = db.collection("users").doc(followID);

	userRef
		.get()
		.then((doc) => doc.data().notifications)
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...oldNotes,
					{ type: "follow", subject: userID, timeStamp: new Date() },
				],
			})
		);
};

const likeNotify = (tweeterID, tweetID, userID) => {
	const userRef = db.collection("users").doc(tweeterID);

	userRef
		.get()
		.then((doc) => doc.data().notifications)
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...oldNotes,
					{ type: "like", object: tweetID, subject: userID, timeStamp: new Date() },
				],
			})
		);
};

const retweetNotify = (tweeterID, userID, tweetID, tweetText) => {
	// tweettext???

	const userRef = db.collection("users").doc(tweeterID);

	userRef
		.get()
		.then((doc) => doc.data().notifications)
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...oldNotes,
					{
						type: "retweet",
						object: tweetID,
						subject: userID,
						text: tweetText,
						timeStamp: new Date(),
					},
				],
			})
		);
};

const replyNotification = (tweeterID, replyID) => {
	const userRef = db.collection("users").doc(tweeterID);

	userRef
		.get()
		.then((doc) => doc.data().notifications)
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...oldNotes,
					{
						type: "reply",
						subject: replyID,
						timeStamp: new Date(),
					},
				],
			})
		);
};

const notify = (type, userID, personID, objectID) => {
	const userRef = db.collection("users").doc(personID);

	userRef
		.get()
		.then((doc) => {
			const data = doc.data()
			return data.notifications
		})
		.then((oldNotes) =>
			userRef.update({
				notifications: [
					...oldNotes || [],
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

// X followed you.
// X liked your tweet / reply.
// X liked N of your tweets.
// reply (full tweet).
// X liked a reply to your tweet.
// N liked your tweet / reply.
// X retetweeted your tweet / reply.
//

// for batches (multiple people, multiple tweets), leave the batchingto the notificaiton feed, not to the database.

// follow, like, reply, retweet.

// followed: follower
// liked: liker, text
// retweet: retweeter, text
// reply: <Tweet/>
