import React, { useState, useContext, useEffect, lazy, Suspense } from "react";
import UserContext from "../context/context.js";
import LoaderContainer from "./LoaderContainer.js";
const Cover = lazy(() => import("./Cover"));
const Warning = lazy(() => import("./Warning"));

const FollowButton = (props) => {
	const { userID, userFollows } = useContext(UserContext);
	const { tweeterID, followed, at, small } = props;
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
		import("../functions/unfollow.js")
			.then((unfollow) => unfollow.default(tweeterID, userID, userFollows))
			.then(() => setWarning(false));
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
				} ${small ? "small-btn" : ""}`}
				style={{ width: "6rem", height: "2rem" }}
			>
				{followed ? "Following" : "Follow"}
			</button>

			{warning && (
				<Suspense fallback={<LoaderContainer />}>
					<Cover toggle={toggleWarning}>
						<Warning
							cancel={toggleWarning}
							title={`Unfollow @${at}?`}
							action={unfollow}
							actionName="Unfollow"
							message="Their Tweets will no longer show up in your home timeline. You can still view their profile though!"
						/>
					</Cover>
				</Suspense>
			)}
		</>
	);
};

export default FollowButton;
