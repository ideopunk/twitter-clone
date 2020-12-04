import { db, storage } from "../../config/fbConfig";

const simpleTweet = (props) => {
	const { userName, text, userAt, userID, userTweets, IMGs } = props;
	const imgAmount = IMGs.length || 0;

	const hashRE = /#\w+/;
	const hashFound = text.match(hashRE) || [];
	const hashSliced = hashFound.map((word) => word.slice(1));
	const palRE = /@\w+/;
	const palFound = text.match(palRE) || [];
	const palSliced = palFound.map((word) => word.slice(1));

	db.collection("tweets")
		.add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			hashtags: hashSliced || [],
			userTags: palSliced || [],
			timeStamp: new Date(),
			retweets: [],
			likes: [],
			replies: [],
			imageCount: imgAmount,
		})
		.then((newTweet) => {
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

			db.collection("users")
				.doc(userID)
				.update({ tweets: [...userTweets, newTweet.id] });
		});
};

export default simpleTweet;
