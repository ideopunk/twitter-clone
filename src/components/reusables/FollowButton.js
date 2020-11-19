import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/context.js";
import Cover from "./Cover";

const FollowButton = (props) => {
	const { userID, userFollows } = useContext(UserContext);
	const { tweeterID, followed, at } = props;
	const [warning, setWarning] = useState(false);

	// freeze if modal up
	useEffect(() => {
		if (warning) {
			document.body.style.position = "fixed";
		} else {
			document.body.style.position = "";
		}
	}, [warning]);

	const follow = () => {
		import("../functions/follow.js").then((follow) =>
			follow.default(tweeterID, userID, userFollows)
		);
	};

	const unfollow = () => {
		import("../functions/unfollow.js").then((unfollow) =>
			unfollow.default(tweeterID, userID, userFollows)
		);
	};

	const toggleWarning = () => {
		setWarning(!warning);
	};

	return (
		<>
			<button
				onClick={followed ? toggleWarning : follow}
				className={`btn ${!props.account && "profile-edit-button"} ${
					followed ? "following-btn" : "follow-btn"
				}`}
				style={{ width: "6rem", height: "2rem" }}
			>
				{followed ? "Following" : "Follow"}
			</button>

			{warning && (
				<Cover toggle={toggleWarning}>
					<UnfollowWarning cancel={toggleWarning} at={at} unfollow={unfollow}/>
				</Cover>
			)}
		</>
	);
};

const UnfollowWarning = (props) => {
	return (
		<div className="modal pad" style={{textAlign:"center", maxWidth:"300px"}}>
			<h3 className="pad">Unfollow @{props.at}?</h3>
			<p className="pad grey">
				Their Tweets will no longer show up in your home timeline. You can still view their
				profile though!
			</p>
			<div className="flex pad" style={{columnGap:"1rem"}}>
				<button className="btn grey-btn" onClick={props.cancel}>Cancel</button>
				<button className="btn" onClick={props.unfollow}>Unfollow</button>
			</div>
		</div>
	);
};

export default FollowButton;
