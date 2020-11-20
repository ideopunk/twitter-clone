import React, { useEffect, useState, useContext } from "react";
import { db, storage } from "../../config/fbConfig";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../context/context.js";
import FollowButton from "./FollowButton";
import Leaf from "../../assets/leaf-outline.svg";

import LoaderContainer from "./LoaderContainer";

const Preview = ({ at }) => {
	const { userFollows, userFollowers } = useContext(UserContext);

	const [profileData, setProfileData] = useState({ follows: [], followers: [] });
	const [image, setImage] = useState("");
	const [followed, setFollowed] = useState(false);
	const history = useHistory();

	useEffect(() => {
		db.collection("users")
			.where("at", "==", at.slice(1))
			.get()
			.then((snapshot) => {
				if (snapshot.size > 0) {
					snapshot.forEach((doc) => {
						const data = doc.data();
						setProfileData({
							at: data.at,
							name: data.name,
							follows: data.follows || [],
							followers: data.followers || [],
							bio: data.bio,
							id: doc.id,
							website: data.website,
							tweetAmount: data.tweets.length,
							joinDate: new Date(data.joinDate.seconds * 1000),
						});
					});
				}
			});
	}, [at]);

	// are we following them?
	useEffect(() => {
		if (userFollows.includes(profileData.id)) {
			setFollowed(true);
		}
	}, [profileData.id, userFollows]);

	// set image
	useEffect(() => {
		if (profileData.id) {
			storage
				.ref("profile_pictures/" + profileData.id + ".png")
				.getDownloadURL()
				.then((url) => {
					setImage(url);
				})
				.catch((err) => {
					console.log(err);
					setImage(Leaf);
				});
		}
	}, [profileData.id]);

	const redirect = (location) => {
		history.push(location);
	};

	return (
		<div className={`preview ${!image && "transparent"}`}>
			<div className="preview-top">
				<img className={`profile-image`} alt="user-profile" src={image} />
				<FollowButton
					tweeterID={profileData.id}
					followed={followed}
					at={profileData.at}
					style={{ height: "3rem" }}
				/>{" "}
			</div>
			<div>
				<h3>{profileData.name}</h3>
				<p className="grey">@{profileData.at}</p>
			</div>
			<p className="bio">{profileData.bio}</p>
			<div>
				<span
					style={{ textDecoration: "none" }}
					onClick={() => redirect(`/${at}/following`)}
				>
					<span style={{ marginRight: "1rem" }}>
						{profileData.follows.length} <span className="grey">Following</span>
					</span>
				</span>
				<span
					style={{ textDecoration: "none" }}
					onClick={() => redirect(`/${at}/followers`)}
				>
					<span>
						{profileData.followers.length} <span className="grey">Followers</span>
					</span>
				</span>
			</div>
		</div>
	);
};

const PreviewLink = (props) => {
	const [hover, setHover] = useState(false);

	return (
		<Link
			to={props.to}
			onMouseOver={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{ textDecoration: "none", position: "relative", height: "fit-content" }}
		>
			{props.children}
			{hover && <Preview at={props.to} />}
		</Link>
	);
};

export default PreviewLink;
