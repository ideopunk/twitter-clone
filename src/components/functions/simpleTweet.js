import { db } from "../../config/fbConfig";

const simpleTweet = (props) => {
	const { userName, text, userAt, userID, userTweets } = props;
	console.log(text)
	const hashRE = /(?<=#)\w+/;
	const hashFound = text.match(hashRE);

	const palRE = /(?<=@)\w+/;
	const palFound = text.match(palRE);
	db.collection("tweets")
		.add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			hashtags: hashFound,
			userTags: palFound,
			timeStamp: new Date(),
			retweets: [],
		})
		.then((newTweet) => {
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });
		});
};

export default simpleTweet;
