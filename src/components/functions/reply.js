import { db } from "../../config/fbConfig";
import notify from "./notify"


const reply = (props) => {
	console.log(props);
	const { tweetID, userName, text, userAt, userID, userTweets } = props;

	const hashRE = /(?<=#)\w+/;
	const hashFound = text.match(hashRE);

	const palRE = /(?<=@)\w+/;
	const palFound = text.match(palRE);

	db.collection("tweets")
		//create the new tweet
		.add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			hashtags: hashFound,
			userTags: palFound,
			timeStamp: new Date(),
			replyTo: tweetID,
		})

		.then((newTweet) => {
			// add it to the user's tweets

			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets || [], newTweet.id] });

			// add it to list of replied-to-tweet's replies. you know??
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

			// notify
			notify("reply", userID, "", tweetID)
		});
};

export default reply;
