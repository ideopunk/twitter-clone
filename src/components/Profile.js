import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Feed from "./reusables/Feed";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";
import Cover from "./reusables/Cover";
import Editor from "./reusables/Editor";

const Profile = (props) => {
	const { userImage, userName, userAt, userID, userFollows, userFollowers } = useContext(
		UserContext
	);
	const [tweetDatas, setTweetDatas] = useState([]);
	const [editor, setEditor] = useState(false);

	useEffect(() => {
		db.collection("tweets")
			.where("userID", "==", userID)
			.orderBy("timeStamp")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					console.log(doc.data());
					console.log(doc.id);
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas(tempArray);
			});
	}, [userID]);

	const toggleEditor = () => {
		setEditor(!editor)
	}

	return (
		<div className="profile center-feed">
			<div className="profile-header">
				<Link
					to="/"
					className="profile-home-link"
					style={{ textDecoration: "none", color: "black" }}
				>
					<SideArrow />
					<div className="profile-home-link-text">
						<h3 className="no-dec">{userName}</h3>
						<p>{tweetDatas.length} tweets</p>
					</div>
				</Link>
				<img className="profile-header-image" src="#" alt="header" />
				<div className="profile-card">
					<img className="profile-image" src={userImage} alt="profile" />
					<button className="profile-edit-button" onClick={toggleEditor}>Edit profile</button>
					<h3>{userName}</h3>
					<p>{userAt}</p>
					<p className="bio">Bio</p>
					<p>
						<span>Website</span>
						<span>Join date</span>
					</p>
					<p>
						<span>{userFollows.length} Following</span>
						<span>{userFollowers.length} Followers</span>
					</p>
				</div>
			</div>
			<Feed tweetDatas={tweetDatas} />
			{editor?
			<Cover toggle={toggleEditor}>
				<Editor />
			</Cover> : ""}
		</div>
	);
};

export default Profile;
