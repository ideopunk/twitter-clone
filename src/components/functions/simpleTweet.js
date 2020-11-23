import { db, storage } from "../../config/fbConfig";

const simpleTweet = (props) => {
	const { userName, text, userAt, userID, userTweets, IMG } = props;
	console.log(text);

	const imgRef = storage.ref("tweet-pictures/" + userID + ".png");


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
			hashtags: hashFound || [],
			userTags: palFound || [],
			timeStamp: new Date(),
			retweets: [],
			likes: [],
			replies: [],
		})
		.then((newTweet) => {
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });
		});
};

export default simpleTweet;
