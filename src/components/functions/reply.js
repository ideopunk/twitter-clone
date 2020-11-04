import { db } from "../../config/fbConfig";

const reply = (props) => {
	const { userName, text, userAt, userID, userTweets, tweetID } = props;

	db.collection("tweets")
		//create the new tweet
		.add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			timeStamp: new Date(),
			replyTo: tweetID,
		})

		// add it to the user's tweets
		.then((newTweet) => {
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });
			return newTweet;

			// add it to list of replied-to-tweet's replies. you know??
		})
		.then((newTweet) => {
			db.collection("tweets")
				.doc(tweetID)
				.get()
				.then((originalTweet) => {
					const originalReplies = originalTweet.replies;
					const newReplies = [...originalReplies, newTweet.id]; // it's okay if there are duplicates, people can reply to a tweet multiple times.
					db.collection("tweets").doc(tweetID).update({ replies: newReplies });
				});
		});
};

export default reply;
