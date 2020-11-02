import React, { useState, useEffect, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
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

	const routedata = useRouteMatch();
	const urlAt = routedata.params.userAt;

	const [userProfile, setUserProfile] = useState(false);
	const [profileID, setProfileID] = useState("");

	useEffect(() => {
		db.collection("users")
			.get()
			.then((snapshot) => console.log(snapshot.docs));

		const itsCurrent = () => {
			setUserProfile(true);
			setProfileID(userID);
			setAt(userAt);
			setName(userName);
			setFollows(userFollows);
			setFollowers(userFollowers);
		};

		urlAt === userAt
			? itsCurrent()
			: db
					.collection("users")
					.where("at", "==", urlAt)
					.get()
					.then((snapshot) => {
						console.log(urlAt);
						console.log(typeof(urlAt))
						console.log(snapshot.docs);
						snapshot.forEach((doc) => {
							console.log(doc);
							setProfileID(doc.id);
						});
					});
	}, [userAt, userID, userName, userFollowers, userFollows, urlAt]);

	const [tweetDatas, setTweetDatas] = useState([]);
	const [editor, setEditor] = useState(false);
	const [header, setHeader] = useState(null);
	const [propic, setPropic] = useState(null);
	const [bio, setBio] = useState("");
	const [website, setWebsite] = useState("");
	const [joinDate, setJoinDate] = useState(null);
	const [at, setAt] = useState("");
	const [name, setName] = useState("");
	const [follows, setFollows] = useState("");
	const [followers, setFollowers] = useState("");

	useEffect(() => {
		if (profileID) {
			storage
				.ref("header_pictures/" + profileID + ".png")
				.getDownloadURL()
				.then((url) => {
					console.log(url);
					setHeader(url);
				})
				.catch((e) => {
					console.log(e);
					setHeader(EllipsisFilled);
				});

			userProfile
				? setPropic(userImage)
				: storage
						.ref("profile_pictures/" + profileID + ".png")
						.getDownloadURL()
						.then((url) => {
							console.log(url);
							setPropic(url);
						})
						.catch((e) => {
							console.log(e);
							setPropic(EllipsisFilled);
						});

			db.collection("tweets")
				.where("userID", "==", profileID)
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
				.doc(profileID)
				.get()
				.then((doc) => {
					const data = doc.data();

					// if they've got bio and website, add em in.
					data.bio && setBio(data.bio);
					data.website && setWebsite(data.website);
					console.log(data.joinDate)
					data.joinDate && setJoinDate(new Date(data.joinDate.seconds * 1000));
				});
		}
	}, [profileID, userImage, userProfile]);

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
						<p className="grey">{tweetDatas.length} tweets</p>
					</div>
				</Link>
				<img className="profile-header-image" src={header} alt="header" />
				<div className="profile-card">
					<img className="main-image" src={propic} alt="profile" />
					<div style={{ height: "3rem" }}>
						<button
							className="btn profile-edit-button"
							style={{ width: "8rem" }}
							onClick={toggleEditor}
						>
							Edit profile
						</button>
					</div>
					<h3>{name}</h3>
					<p className="grey">{at}</p>
					<p className="bio">{bio}</p>
					<p className="grey">
						<span>{website}</span>
						<span> Joined {String(joinDate).slice(4, 8) + String(joinDate).slice(11, 16) }</span>
					</p>
					<p>
						<span style={{ marginRight: "1rem" }}>
							{follows.length} <span className="grey">Following</span>
						</span>
						<span>
							{followers.length} <span className="grey">Followers</span>
						</span>
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
