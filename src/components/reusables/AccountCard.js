import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../config/fbConfig";
import Leaf from "../../assets/leaf-outline.svg";

import FollowButton from "./FollowButton";
import UserContext from "../context/context.js";

const AccountCard = (props) => {
	const { bio, id, name, at } = props;
	const { userID, userFollows } = useContext(UserContext);
	const [image, setImage] = useState("");

	useEffect(() => {
		storage
			.ref("profile_pictures/" + id + ".png")
			.getDownloadURL()
			.then((url) => {
				setImage(url);
			})
			.catch((err) => {
				console.log(err);
				setImage(Leaf);
			});
	}, [id]);

	return (
		<div className="account-card">
			<Link to={`/${at}`}>
				{image ? (
					<img className="profile-image" alt="user-profile" src={image} />
				) : (
					<div className="profile-image" />
				)}
			</Link>
			<div style={{width: "100%"}}>
				<div className="account-top">
					<div>
						<p className="tweeter-name">{name}</p>
						<p className="tweeter-at">@{at}</p>
					</div>
					<FollowButton
						tweeterID={id}
						account={true}
						followed={userFollows.includes(id)}
					/>
				</div>
				<p>{bio}</p>
			</div>
		</div>
	);
};

export default AccountCard;
