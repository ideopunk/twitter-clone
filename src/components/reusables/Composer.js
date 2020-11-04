import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Gif } from "../../assets/gif-icon.svg";
import { ReactComponent as Poll } from "../../assets/poll-icon.svg";
import { ReactComponent as Emoji } from "../../assets/emoji-icon.svg";
import { ReactComponent as Schedule } from "../../assets/schedule-icon.svg";
import { db } from "../../config/fbConfig";
import UserContext from "../context/context.js";
import ComposerCircle from "./ComposerCircle";

const Composer = (props) => {
	const { modal, replyData } = props;

	const { userName, userAt, userID, userImage, userTweets } = useContext(UserContext);

	const [text, setText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("hand sub");
		if (replyData) {
			const {tweetID} = replyData
			db.collection("tweets")
				.add({
					name: userName,
					text: text,
					at: userAt,
					userID: userID,
					timeStamp: new Date(),
					replyTo: replyData.tweetID,
					replyAt: replyData.at
				})
				.then((newTweet) => {
					console.log(newTweet);
					db.collection("users")
						.doc(userID)
						.update({ tweets: [...userTweets, newTweet.id] });
				});
		} else {
			import("../functions/simpleTweet.js").then((simpleTweet) =>
				simpleTweet.default(userName, text, userAt, userID, userTweets)
			);
		}
	};

	const handleChange = (e) => {
		console.log(e.target.value);
		setText(e.target.value);
	};

	return (
		<form className={`${modal && `modal`} composer`}>
			<Link to={`/${userAt}`}>
				<img src={userImage} alt="user-profile" className="profile-image" />
			</Link>
			<div className="composer-right">
				<input
					maxLength={280}
					required
					className="composer-input"
					placeholder="What's happening?"
					onChange={handleChange}
				/>
				<div className="composer-options">
					<div className="composer-icon-div">
						<Picture />
					</div>
					<div className="composer-icon-div">
						<Gif />
					</div>
					<div className="composer-icon-div">
						<Poll />
					</div>
					<div className="composer-icon-div">
						<Emoji />
					</div>
					<div className="composer-icon-div">
						<Schedule />
					</div>
					<div className="composer-circle-container">
						{text && <ComposerCircle length={text.length} />}
					</div>
					<input
						className={`btn tweet-btn ${text ? `active-button` : ""}`}
						style={{ width: "100px", marginLeft: "auto" }}
						type="submit"
						onClick={handleSubmit}
						value="Tweet"
					/>
				</div>
			</div>
		</form>
	);
};

export default Composer;
