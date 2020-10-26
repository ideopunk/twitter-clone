import React, { useContext, useState } from "react";
import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Gif } from "../../assets/gif-icon.svg";
import { ReactComponent as Poll } from "../../assets/poll-icon.svg";
import { ReactComponent as Emoji } from "../../assets/emoji-icon.svg";
import { ReactComponent as Schedule } from "../../assets/schedule-icon.svg";
import { db } from "../../config/fbConfig";
import UserContext from "../context/context.js";

const Composer = (props) => {
	const { modal } = props;
	const { userName, userAt, userID, userImage } = useContext(UserContext);

	const [text, setText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("hand sub");
		db.collection("tweets").add({
			name: userName,
			text: text,
			at: userAt,
			userID: userID,
			timeStamp: new Date(),
		});
	};

	const handleChange = (e) => {
		console.log(e.target.value);
		setText(e.target.value);
	};

	return (
		<form className={`composer ${modal ? `composer-modal` : ""}`}>
			<img src={userImage} alt="user-profile" className="profile-image" />
			<div className="composer-right">
				<input
					maxLength={240}
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
