import { db, storage } from "../../config/fbConfig";
import notify from "./notify";

const reply = (props) => {
	console.log(props);
	const { tweetID, tweeterID, userName, text, userAt, userID, userTweets, IMGs } = props;

	const imgAmount = IMGs.length || 0;

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
			hashtags: hashFound || [],
			userTags: palFound || [],
			timeStamp: new Date(),
			replyTo: tweetID, // to load original tweet
			replyUserID: tweeterID,
			retweets: [],
			likes: [],
			replies: [],
			imageCount: imgAmount,
		})

		.then((newTweet) => {
			// create references for images.
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
			// add it to the user's tweets
			console.log(newTweet);
			db.collection("users")
				.doc(userID)
				.update({ tweets: [...(userTweets || []), newTweet.id] });

			// add it to list of replied-to-tweet's replies. you know??
			db.collection("tweets")
				.doc(tweetID)
				.get()
				.then((originalTweet) => {
					const originalData = originalTweet.data();
					const originalReplies = originalData.replies;
					console.log(originalReplies);
					const newReplies = [...(originalReplies || []), newTweet.id]; // it's okay if there are duplicates, people can reply to a tweet multiple times.
					console.log(newReplies);
					db.collection("tweets").doc(tweetID).update({ replies: newReplies });

					// notify
					if (userID !== originalData.userID) {
						notify("reply", userID, originalData.userID, newTweet.id);
					}
				});
		});
};

export default reply;
