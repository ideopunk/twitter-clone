import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../config/fbConfig";

import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { ReactComponent as Quote } from "../../assets/quote-outline.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";
import { ReactComponent as Like } from "../../assets/like-icon.svg";
import { ReactComponent as Share } from "../../assets/share-icon.svg";

const Tweet = (props) => {
	const [image, setImage] = useState("");

	const { name, at, time, text, retweets, likes, replying, userID } = props;
	console.log(userID);
	console.log(time);
	const date = new Date(time.seconds * 1000);
	console.log(date);
	const likeAmount = likes ? likes.length : "";
	const retweetsAmount = retweets ? retweets.length : "";

	// listen for auth status changes
	useEffect(() => {
		storage
			.ref("profile_pictures/" + userID + ".png")
			.getDownloadURL()
			.then((url) => setImage(url));
	}, [userID]);

	return (
		<div className="tweet">
			<img className="profile-image" alt="user-profile" src={image} />
			<div className="tweet-main">
				<p className="tweet-top-data">
					<span className="tweeter-name">{name}</span>
					<span className="tweeter-at">{at}</span>
					<span className="tweet-time">{date.toDateString()}</span>
					<Arrow className="little-arrow" />
				</p>
				{replying ? <p className="tweet-reply">Replying to {replying}</p> : ""}
				<p className="tweet-text">{text}</p>
				<div className="tweet-responses">
					<div className="tweet-svg-div">
						<Quote />
					</div>
					<div className="tweet-svg-div">
						<Retweet />
						{retweetsAmount}
					</div>
					<div className="tweet-svg-div">
						<Like />
						{likeAmount}
					</div>
					<div className="tweet-svg-div">
						<Share />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tweet;
