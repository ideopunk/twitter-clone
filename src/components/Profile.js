import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Feed from "./reusables/Feed";
import { auth, db, storage } from "../config/fbConfig";
import UserContext from "./context/context.js";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";
import Cover from "./reusables/Cover";
import Editor from "./reusables/Editor";
import EllipsisFilled from "../assets/ellipsis-horizontal.svg";

const Profile = (props) => {
	const { userImage, userName, userAt, userID, userFollows, userFollowers } = useContext(
		UserContext
	);
	const [tweetDatas, setTweetDatas] = useState([]);

	// temporarily set to true
	const [editor, setEditor] = useState(true);
	
	const [header, setHeader] = useState(null);
	const [bio, setBio] = useState("");
	const [website, setWebsite] = useState("");
	const [joinDate, setJoinDate] = useState(null);

	useEffect(() => {

		storage
			.ref("header_pictures/" + userID + ".png")
			.getDownloadURL()
			.then((url) => {
				console.log(url);
				setHeader(url);
			})
			.catch(() => setHeader(EllipsisFilled));

		db.collection("tweets")
			.where("userID", "==", userID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					console.log(doc.id);
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas(tempArray);
			});

		db.collection("users")
			.doc(userID)
			.get()
			.then((doc) => {
				const data = doc.data();

				// if they've got bio and website, add em in.
				data.bio && setBio(data.bio);
				data.website && setWebsite(data.website);
			});

		setJoinDate(auth.currentUser.metadata.creationTime.slice(4, 16));
	}, [userID]);

	const toggleEditor = () => {
		setEditor(!editor);
	};

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
				<img className="profile-header-image" src={header} alt="header" />
				<div className="profile-card">
					<img className="main-image" src={userImage} alt="profile" />
					<div style={{height: "3rem"}}>
						<button
							className="btn profile-edit-button"
							style={{ width: "8rem" }}
							onClick={toggleEditor}
						>
							Edit profile
						</button>
					</div>
					<h3>{userName}</h3>
					<p>{userAt}</p>
					<p className="bio">{bio}</p>
					<p>
						<span>{website}</span>
						<span> Joined {joinDate}</span>
					</p>
					<p>
						<span style={{marginRight: "1rem"}}>{userFollows.length} Following</span>
						<span>{userFollowers.length} Followers</span>
					</p>
				</div>
			</div>
			<Feed tweetDatas={tweetDatas} />
			{editor ? (
				<Cover toggle={toggleEditor}>
					<Editor header={header} bio={bio} website={website} />
				</Cover>
			) : (
				""
			)}
		</div>
	);
};

export default Profile;
