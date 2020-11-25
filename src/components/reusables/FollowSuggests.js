import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/context.js";
import { db } from "../../config/fbConfig";
import AccountCard from "./AccountCard";

const FollowSuggest = () => {
	const { userID, userFollows } = useContext(UserContext);
	const [array, setArray] = useState([]);

	useEffect(() => {
		// only do this once userFollows is filled, or else the check won't work later in this.
		userFollows &&
			db
				.collection("users")
				.get()
				.then((snapshot) => {
					let tempArray = [];
					snapshot.forEach((user) => {
						if (
							!userFollows.includes(user.id) &&
							user.id !== userID &&
							tempArray.length < 2
						) {
							const data = user.data();
							tempArray.push(
								<AccountCard
									key={user.id}
									id={user.id}
									name={data.name}
									at={data.at}
								/>
							);
						}
					});
					setArray(tempArray);
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
