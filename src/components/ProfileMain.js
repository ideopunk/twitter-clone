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
	const [profileData, setProfileData] = useState({ follows: [], followers: [] });

	const [tweetDatas, setTweetDatas] = useState([]);

	const [editor, setEditor] = useState(false);

	const [followed, setFollowed] = useState("");

	// consoling
	useEffect(() => {
		console.log("profiledata");
		console.log(profileData);
	}, [profileData]);

	// set user data
	useEffect(() => {
		console.log("set user data");

		userProfile
			? setProfileData({
					at: userAt,
					name: userName,
					follows: userFollows || [],
					followers: userFollowers || [],
					id: userID,
					image: userImage,
			  })
			: db
					.collection("users")
					.doc(profileID)
					.get()
					.then((doc) => {
						const data = doc.data();

						// if they've got bio and website, add em in.
						// data.bio && setBio(data.bio);
						// data.website && setWebsite(data.website);
						// data.joinDate && setJoinDate(new Date(data.joinDate.seconds * 1000));
						// setFollowers(data.followers);
						// setFollows(data.follows);
						// setAt(data.at);
						// setName(data.name);
						setProfileData((prevData) => ({
							...prevData,
							at: data.at,
							name: data.name,
							follows: data.follows || [],
							followers: data.followers || [],
							bio: data.bio,
							id: doc.id,
							website: data.website,
							joinDate: new Date(data.joinDate.seconds * 1000),
						}));
					});
	}, [userProfile, profileID, userImage, userAt, userID, userName, userFollowers, userFollows]);

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
			? setProfileData((prevData) => ({ ...prevData, image: userImage }))
			: storage
					.ref("profile_pictures/" + profileID + ".png")
					.getDownloadURL()
					.then((url) => {
						// setPropic(url);
						setProfileData((prevData) => ({ ...prevData, image: url }));
					})
					.catch((e) => {
						console.log(e);
						// setPropic(Leaf);
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
			<div className="profile-header">
				<Link
					to="/"
					className="profile-home-link"
					style={{ textDecoration: "none", color: "black" }}
				>
					<SideArrow />
					<div className="profile-home-link-text">
						<h3 className="no-dec">{profileData.name}</h3>
						<p className="grey">{tweetDatas.length} tweets</p>
					</div>
				</Link>
				<img className="profile-header-image" src={profileData.header} alt="header" />
				<div className="profile-card">
					<img className="main-image" src={profileData.image} alt="profile" />
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
					<h3>{profileData.name}</h3>
					<p className="grey">{profileData.at}</p>
					<p className="bio">{profileData.bio}</p>
					<p className="grey">
						<span>{profileData.website}</span>
						<span>
							{" "}
							Joined{" "}
							{String(profileData.joinDate).slice(4, 8) +
								String(profileData.joinDate).slice(11, 16)}
						</span>
					</p>
					<p>
						<Link to={`${url}/following`}>
							<span style={{ marginRight: "1rem" }}>
								{profileData.follows.length} <span className="grey">Following</span>
							</span>
						</Link>
						<Link to={`${url}/followers`}>
							<span>
								{profileData.followers.length}{" "}
								<span className="grey">Followers</span>
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
					<Editor
						header={profileData.header}
						bio={profileData.bio}
						website={profileData.website}
					/>
				</Cover>
			) : (
				""
			)}
		</>
	);
};

export default ProfileMain;
