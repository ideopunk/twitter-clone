import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../config/fbConfig";

import { ReactComponent as Quote } from "../../assets/quote-outline.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";
import { ReactComponent as Like } from "../../assets/like-icon.svg";
import { ReactComponent as Copy } from "../../assets/copy-icon.svg";
import { ReactComponent as Dots } from "../../assets/dots.svg";

const Tweet = (props) => {
	const [image, setImage] = useState("");
	const [dropdown, setDropdown] = useState(false);

	const { name, at, time, text, retweets, likes, replying, tweetID, tweeterID, userID } = props;
	const date = new Date(time.seconds * 1000);
	const likeAmount = likes ? likes.length : "";
	const retweetsAmount = retweets ? retweets.length : "";

	// tweet rendered
	useEffect(() => {console.log('rendered')}, [])

	// listen for auth status changes
	useEffect(() => {
		storage
			.ref("profile_pictures/" + tweeterID + ".png")
			.getDownloadURL()
			.then((url) => setImage(url));
	}, [tweeterID]);

	const toggleDropdown = () => {
		setDropdown(!dropdown);
	};


	return (
		<div className="tweet">
			<img className="profile-image" alt="user-profile" src={image} />
			<div className="tweet-main">
				<div className="tweet-top-data">
					<span className="tweeter-name">{name}</span>
					<span className="tweeter-at">{at}</span>
					<span className="tweet-time grey">{date.toDateString()}</span>
					<div style={{ marginLeft: "auto" }}>
						{dropdown ? (
							<Dropdown
								deleteTweet={props.deleteTweet}
								tweetID={tweetID}
								userID={userID}
								tweeterID={tweeterID}
							/>
						) : (
							""
						)}
						<Dots className="little-arrow" onClick={toggleDropdown} />
					</div>
				</div>
				{replying ? <p className="tweet-reply">Replying to {replying}</p> : ""}
				<p className="tweet-text">{text}</p>
				<div className="tweet-responses">
					<div className="tweet-svg-div grey">
						<Quote />
					</div>
					<div className="tweet-svg-div grey">
						<Retweet />
						{retweetsAmount}
					</div>
					<div className="tweet-svg-div grey">
						<Like />
						{likeAmount}
					</div>
					<div className="tweet-svg-div grey">
						<Copy />
					</div>
				</div>
			</div>
		</div>
	);
};

const Dropdown = (props) => {
	const { tweetID, userID, tweeterID } = props;
	const [userTweet, setUserTweet] = useState(false);

	useEffect(() => {
		userID === tweeterID && setUserTweet(true);
	}, [userID, tweeterID]);


	const unfollowAccount = () => {
		console.log("unfol");
	};

	return userTweet ? (
		<div className="tweet-dropdown" value={tweetID} onClick={props.deleteTweet}>
			Delete this tweet
		</div>
	) : (
		<div className="tweet-dropdown"   onClick={unfollowAccount}>
			Unfollow this account
		</div>
	);
};

export default Tweet;
