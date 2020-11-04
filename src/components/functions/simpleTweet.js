import { db } from "../../config/fbConfig";

const simpleTweet = (props) => {
	const { userName, text, userAt, userID, userTweets } = props;

	db.collection("tweets")
		.add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			timeStamp: new Date(),
		})
		.then((newTweet) => {
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });
		});
};

export default simpleTweet;
