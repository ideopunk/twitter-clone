import { db } from "../../config/fbConfig";

const reply = (props) => {
	console.log(props);
	const { tweetID, userName, text, userAt, userID, userTweets } = props;
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
				.update({ tweets: [...userTweets || [], newTweet.id] });
			return newTweet;

			// add it to list of replied-to-tweet's replies. you know??
		})
		.then((newTweet) => {
			db.collection("tweets")
				.doc(tweetID)
				.get()
				.then((originalTweet) => {
					const originalReplies = originalTweet.replies;
					console.log(originalReplies);
					const newReplies = [...originalReplies || [], newTweet.id]; // it's okay if there are duplicates, people can reply to a tweet multiple times.
					console.log(newReplies);
					db.collection("tweets").doc(tweetID).update({ replies: newReplies });
				});
		});
};

export default reply;
