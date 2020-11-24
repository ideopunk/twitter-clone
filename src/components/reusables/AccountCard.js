import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../config/fbConfig";
import Leaf from "../../assets/leaf-outline.svg";
import PreviewLink from "./Preview";
import FollowButton from "./FollowButton";
import UserContext from "../context/context.js";

const AccountCard = (props) => {
	const { bio, id, name, at } = props;
	const { userID, userFollows, userFollowers } = useContext(UserContext);
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
		<div className={`account-card ${!bio ? "straighten" : ""}`}>
			<PreviewLink to={`/${at}`}>
				{image ? (
					<img className="profile-image" alt="user-profile" src={image} />
				) : (
					<div className="profile-image" />
				)}
			</PreviewLink>
			<div className="straighten" style={{ width: "100%" }}>
				<div className={`account-top ${!bio ? "straighten" : ""}`}>
					<PreviewLink to={`/${at}`} className="no-dec">
						<div>
							<p className="tweeter-name hover-under">{name}</p>
							<p className="tweeter-at ">
								@{at}{" "}
								{userFollowers.includes(id) && (
									<span className="follows-you">Follows you</span>
								)}
							</p>
						</div>
					</PreviewLink>
					<FollowButton
						tweeterID={id}
						account={true}
						small={true}
						followed={userFollows.includes(id)}
					/>
				</div>
				{bio ? <p>{bio}</p> : ""}
			</div>
		</div>
	);
};

export default AccountCard;
