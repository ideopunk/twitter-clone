import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/context.js";

import { db, storage } from "../../config/fbConfig";
import Leaf from "../../assets/leaf-outline.svg";

const FollowSuggest = () => {
	const { userID, userFollows } = useContext(UserContext);

	const [array, setArray] = useState([]);

	// const follow = (e) => {
	// 	e.persist();
	// 	import("../functions/follow.js").then((follow) => follow.default(e, userID, userFollows));
	// };

	useEffect(() => {
		const follow = (e) => {
			e.persist();
			import("../functions/follow.js").then((follow) =>
				follow.default(e, userID, userFollows)
			);
		};

		// only do this once userFollows is filled, or else the check won't work later in this. 
		userFollows.length &&
			db
				.collection("users")
				.get()
				.then((snapshot) => {
					let num = 0;
					snapshot.forEach((user) => {
						console.log(user.id, userFollows);
						console.log(userFollows.includes(user.id));
						console.log(!userFollows.includes(user.id));
						if (!userFollows.includes(user.id) && user.id !== userID && num < 2) {
							const data = user.data();
							storage
								.ref("profile_pictures/" + user.id + ".png")
								.getDownloadURL()
								.then((url) => {
									setArray((a) => [
										...a,
										<div className="tweet">
											<img
												src={url}
												alt="suggest"
												className="profile-image"
											/>
											<div className="tweet-main">
												<p className="tweeter-name">{data.name}</p>
												<p className="tweeter-at">{data.at}</p>
											</div>
											<button
												value={user.id}
												onClick={follow}
												className="btn follow-btn"
											>
												Follow
											</button>
										</div>,
									]);
								})
								.catch((err) => {
									setArray((a) => [
										...a,

										<div className="tweet">
											<img
												src={Leaf}
												alt="suggest"
												className="profile-image"
											/>
											<div className="tweet-main">
												<p className="tweeter-name">{data.name}</p>
												<p className="tweeter-at">{data.at}</p>
											</div>
											<button
												value={user.id}
												onClick={follow}
												className="btn follow-btn"
											>
												Follow
											</button>
										</div>,
									]);
								});
						}
					});
				});
	}, [userFollows, userID]);

	return (
		<div className="follow-suggest side-box">
			<h3 className="side-box-title">Who to follow</h3>
			{array}
		</div>
	);
};

export default FollowSuggest;
