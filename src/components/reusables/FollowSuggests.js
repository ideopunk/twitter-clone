import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/context.js";
import FollowButton from "../reusables/FollowButton";
import { db, storage } from "../../config/fbConfig";
import Leaf from "../../assets/leaf-outline.svg";
import { Link, useRouteMatch, useLocation } from "react-router-dom";
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
					let num = 0;
					snapshot.forEach((user) => {
						if (!userFollows.includes(user.id) && user.id !== userID && num < 2) {
							const data = user.data();
							storage
								.ref("profile_pictures/" + user.id + ".png")
								.getDownloadURL()
								.then((url) => {
									throw url;
								})
								.catch((err) => {
									let image;
									if (err["code"]) {
										image = Leaf;
									} else {
										image = err;
									}

									setArray((a) => [
										...a,

										<AccountCard
											key={user.id}
											id={user.id}
											name={data.name}
											at={data.at}
										/>,
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
