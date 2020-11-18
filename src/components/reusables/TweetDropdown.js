import React, { useState, useEffect, useContext, useRef } from "react";

const TweetDropdown = (props) => {
	const { followed, tweetID, userID, tweeterID } = props;
	const [userTweet, setUserTweet] = useState(false);

	const ref = useRef(null);

	// change options depending on whose tweet it is
	useEffect(() => {
		userID === tweeterID && setUserTweet(true);
	}, [userID, tweeterID]);

	// clicks outside the dropdown should close the dropdown
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				props.toggle(e)
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [props]);

	return userTweet ? (
		<div className="tweet-dropdown" value={tweetID} onClick={props.deleteTweet} ref={ref}>
			Delete this tweet
		</div>
	) : (
		<div
			className="tweet-dropdown"
			value={tweeterID}
			onClick={followed ? props.unfollow : props.follow}
			ref={ref}
		>
			{followed ? "Unfollow this account" : "Follow this account"}
		</div>
	);
};

export default TweetDropdown;
