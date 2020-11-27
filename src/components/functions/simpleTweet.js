import { db, storage } from "../../config/fbConfig";

const simpleTweet = (props) => {
	const { userName, text, userAt, userID, userTweets, IMGs } = props;
	console.log(text);
	console.log(new Date())
	const imgAmount = IMGs.length || 0;

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
			imageCount: imgAmount,
		})
		.then((newTweet) => {
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });

			for (const [index, img] of IMGs.entries()) {
				const imgRef = storage.ref("tweet_pictures/" + newTweet.id + "/" + index + ".png");
				const uploadTask = imgRef.put(img);
				uploadTask.on(
					"state_changed",

					// how it's going
					(snapshot) => {},

					// how it goofed it
					(error) => {
						console.log(error);
					},

					// how it succeeded
					() => {
						console.log("success");
					}
				);
			}
		});
};

export default simpleTweet;
