import React, { useState, useEffect, useContext } from "react";
import { Link, Switch, Route, useRouteMatch, NavLink } from "react-router-dom";
import Feed from "./reusables/Feed";
import LikeFeed from "./reusables/LikeFeed";
import { db, storage } from "../config/fbConfig";
import UserContext from "./context/context.js";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";
import Cover from "./reusables/Cover";
import Editor from "./reusables/Editor";
import FollowButton from "./reusables/FollowButton";
import EllipsisFilled from "../assets/ellipsis-horizontal.svg";
import Leaf from "../assets/leaf-outline.svg";
import LoaderContainer from "./reusables/LoaderContainer";

const ProfileMain = (props) => {
	const { userImage, userName, userAt, userID, userFollows, userFollowers } = useContext(
		UserContext
	);

	const { path, url, params } = useRouteMatch();
	const urlAt = params.profile;

	const { userProfile, profileID } = props;
	console.log(userProfile, profileID);
	const [profileData, setProfileData] = useState({});

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
	const [followed, setFollowed] = useState("");

	// set user data
	useEffect(() => {
		console.log("set user data");

		const itsCurrent = () => {
			// setAt(userAt);
			// setName(userName);
			// setFollows(userFollows);
			// setFollowers(userFollowers);

			setProfileData({
				at: userAt,
				name: userName,
				follows: userFollows,
				followers: userFollowers,
				id: userID,
				image: userImage,
			});
		};

		userProfile
			? itsCurrent()
			: db
					.collection("users")
					.where("at", "==", urlAt)
					.get()
					.then((snapshot) => {
						snapshot.forEach((doc) => {
							console.log(doc);

							setProfileData({ id: doc.id, ...doc.data() });
						});
					});
	}, [userProfile, userImage, userAt, userID, userName, userFollowers, userFollows, urlAt]);

	// set header
	useEffect(() => {
		console.log("set header");

		!profileData.header &&
			storage
				.ref("header_pictures/" + profileID + ".png")
				.getDownloadURL()
				.then((url) => {
					// setHeader(url);
					setProfileData((prevData) => ({ ...prevData, header: url }));
				})
				.catch((e) => {
					console.log(e);
					// setHeader(EllipsisFilled);
					setProfileData((prevData) => ({ ...prevData, header: EllipsisFilled }));
				});
	}, [profileID, profileData.header]);

	// set profile picture
	useEffect(() => {
		console.log("set pro pic");

		userProfile
			? //  setPropic(userImage)
			  setProfileData((prevData) => ({ ...prevData, image: userImage }))
			: storage
					.ref("profile_pictures/" + profileID + ".png")
					.getDownloadURL()
					.then((url) => {
						setPropic(url);
					})
					.catch((e) => {
						console.log(e);
						setPropic(Leaf);
						setProfileData((prevData) => ({ ...prevData, image: Leaf }));
					});
	}, [userProfile, userImage, profileID]);

	// set tweetdata
	useEffect(() => {
		console.log("set tweetdata");
		db.collection("tweets")
			.where("userID", "==", profileID)
			.orderBy("timeStamp", "desc")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas(tempArray);
			});
	}, [profileID]);

	// set data if not own profile....
	useEffect(() => {
		console.log("set data if not own profile");

		!userProfile &&
			db
				.collection("users")
				.doc(profileID)
				.get()
				.then((doc) => {
					const data = doc.data();

					// if they've got bio and website, add em in.
					data.bio && setBio(data.bio);
					data.website && setWebsite(data.website);
					data.joinDate && setJoinDate(new Date(data.joinDate.seconds * 1000));
					if (!userProfile) {
						setFollowers(data.followers);
						setFollows(data.follows);
						setAt(data.at);
						setName(data.name);
						setProfileData((prevData) => ({
							...prevData,
							at: data.at,
							name: data.name,
							follows: data.follows,
							followers: data.followers,
							bio: data.bio,
							website: data.website,
							joinDate: new Date(data.joinDate.seconds * 1000),
						}));
					}
				});
	}, [profileID, userImage, userProfile, userFollows]);

	// if this isn't our own profile, are we following this user?
	useEffect(() => {
		console.log("set following");

		!userProfile && setFollowed(userFollows.includes(profileID));
	}, [userProfile, userFollows, profileID]);

	const toggleEditor = () => {
		setEditor(!editor);
	};

	return (
		<>
			{profileID ? (
				<div className="profile-header">
					<Link
						to="/"
						className="profile-home-link"
						style={{ textDecoration: "none", color: "black" }}
					>
						<SideArrow />
						<div className="profile-home-link-text">
							<h3 className="no-dec">{name}</h3>
							<p className="grey">{tweetDatas.length} tweets</p>
						</div>
					</Link>
					<img className="profile-header-image" src={header} alt="header" />
					<div className="profile-card">
						<img className="main-image" src={propic} alt="profile" />
						{userProfile ? (
							<div style={{ height: "3rem" }}>
								<button
									className="btn profile-edit-button"
									style={{ width: "8rem" }}
									onClick={toggleEditor}
								>
									Edit profile
								</button>
							</div>
						) : (
							<FollowButton tweeterID={profileID} followed={followed} />
						)}
						<h3>{name}</h3>
						<p className="grey">{at}</p>
						<p className="bio">{bio}</p>
						<p className="grey">
							<span>{website}</span>
							<span>
								{" "}
								Joined{" "}
								{String(joinDate).slice(4, 8) + String(joinDate).slice(11, 16)}
							</span>
						</p>
						<p>
							<Link to={`${url}/following`}>
								<span style={{ marginRight: "1rem" }}>
									{follows.length} <span className="grey">Following</span>
								</span>
							</Link>
							<Link to={`${url}/followers`}>
								<span>
									{followers.length} <span className="grey">Followers</span>
								</span>
							</Link>
						</p>
					</div>
					<div className="profile-feed-selector-container">
						<NavLink
							to={`${url}`}
							className="profile-feed-selector"
							activeClassName="p-f-s-active"
						>
							Tweets
						</NavLink>
						<NavLink
							to={`${url}/with_replies`}
							className="profile-feed-selector"
							activeClassName="p-f-s-active"
						>
							Tweets & replies
						</NavLink>
						<NavLink
							to={`${url}/media`}
							className="profile-feed-selector"
							activeClassName="p-f-s-active"
						>
							Media
						</NavLink>
						<NavLink
							to={`${url}/likes`}
							className="profile-feed-selector"
							activeClassName="p-f-s-active"
						>
							Likes
						</NavLink>
					</div>
				</div>
			) : (
				<LoaderContainer />
			)}

			<Switch>
				<Route path={`${path}/with_replies`}>
					<Feed tweetDatas={tweetDatas} />
				</Route>

				<Route path={`${path}/media`}>
					<Feed tweetDatas={tweetDatas} />
				</Route>

				<Route path={`${path}/likes`}>
					<LikeFeed profileID={profileID} />
				</Route>

				<Route exact path={path}>
					<Feed tweetDatas={tweetDatas} />
				</Route>
			</Switch>

			{editor ? (
				<Cover toggle={toggleEditor}>
					<Editor header={header} bio={bio} website={website} />
				</Cover>
			) : (
				""
			)}
		</>
	);
};

export default ProfileMain;
