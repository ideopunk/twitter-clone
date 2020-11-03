import React, { useContext } from "react";
import UserContext from "../context/context.js";

const FollowButton = (props) => {
	const { userID, userFollows } = useContext(UserContext);

	const { tweeterID, followed } = props;

	const follow = () => {
		import("../functions/follow.js").then((follow) =>
			follow.default(tweeterID, userID, userFollows)
        );
	};

	const unfollow = () => {
        import("../functions/unfollow.js").then(unfollow => unfollow.default(tweeterID, userID, userFollows))
    };

	return (
		<button
			onClick={followed ? unfollow : follow}
            className={`btn ${!props.account && "profile-edit-button"} ${followed ? "following-btn" : "follow-btn"}`}
            style={{width: "6rem", height: "2rem"}}
		>
			{followed ? "Following" : "Follow"}
		</button>
	);
};

export default FollowButton;
