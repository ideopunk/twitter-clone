import React, { useEffect, useState, useContext, Suspense } from "react";
import { db, storage } from "../../config/fbConfig";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../context/context.js";
import FollowButton from "./FollowButton";
import Leaf from "../../assets/leaf-outline.svg";

import LoaderContainer from "./LoaderContainer";

// previews show when hovering over user tags.
const Preview = ({ at }) => {
	const { userFollows, userFollowers } = useContext(UserContext);

	const [profileData, setProfileData] = useState({ follows: [], followers: [] });
	const [image, setImage] = useState("");
	const [followed, setFollowed] = useState(false);
	const history = useHistory();

	useEffect(() => {
		let mounted = true;

		db.collection("users")
			.where("at", "==", at.slice(1))
			.get()
			.then((snapshot) => {
				if (snapshot.size > 0) {
					snapshot.forEach((doc) => {
						const data = doc.data();
						if (mounted) {
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
						}
					});
				}
			});
		return () => (mounted = false);
	}, [at]);

	// are we following them?
	useEffect(() => {
		if (userFollows && userFollows.includes(profileData.id)) {
			setFollowed(true);
		}
	}, [profileData.id, userFollows]);

	// set image
	useEffect(() => {
		let mounted = true;
		if (profileData.id) {
			storage
				.ref("profile_pictures/" + profileData.id + ".png")
				.getDownloadURL()
				.then((url) => {
					if (mounted) {
						setImage(url);
					}
				})
				.catch((err) => {
					console.log(err);
					if (mounted) {
						setImage(Leaf);
					}
				});
		}

		return () => (mounted = false);
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
				<h3 className="hover-under">{profileData.name}</h3>
				<p className="grey">
					@{profileData.at}{" "}
					{userFollowers && userFollowers.includes(profileData.id) && (
						<span className="follows-you">Follows you</span>
					)}
				</p>
			</div>
			<p className="bio">{profileData.bio}</p>
			<div>
				<span className="hover-under" onClick={() => redirect(`/${at}/following`)}>
					<span style={{ marginRight: "1rem" }}>
						{profileData.follows.length} <span className="grey">Following</span>
					</span>
				</span>
				<span className="hover-under" onClick={() => redirect(`/${at}/followers`)}>
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
			style={{ position: "relative", height: "fit-content" }}
			className={props.className + " hover-under"}
		>
			{props.children}
			{hover && (
				<Suspense fallback={<LoaderContainer />}>
					{" "}
					<Preview at={props.to} />
				</Suspense>
			)}
		</Link>
	);
};

export default PreviewLink;
