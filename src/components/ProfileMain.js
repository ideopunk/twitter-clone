import React, { useState, useEffect, useContext } from "react";
import { Link, Switch, Route, useRouteMatch, NavLink } from "react-router-dom";
import ProfileFeed from "./reusables/ProfileFeed";
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
	const {
		userImage,
		userName,
		userAt,
		userID,
		userFollows,
		userFollowers,
		userBio,
		userJoinDate,
		userTweets,
	} = useContext(UserContext);
	const { path, url } = useRouteMatch();
	const { userProfile, profileID } = props;

	const [profileData, setProfileData] = useState({ follows: [], followers: [] });
	const [editor, setEditor] = useState(false);
	const [followed, setFollowed] = useState("");
	const [imageLoaded, setImageLoaded] = useState(false);

	// set profile data
	useEffect(() => {
		console.log("set user data");
		console.log(userJoinDate);

		// if it's the current user's profile...
		userProfile
			? setProfileData({
					at: userAt,
					name: userName,
					follows: userFollows || [],
					followers: userFollowers || [],
					id: userID,
					image: userImage,
					bio: userBio,
					tweetAmount: userTweets.length,

					joinDate: new Date(userJoinDate.seconds * 1000),
			  })
			: // if it's somebody else...
			  db
					.collection("users")
					.doc(profileID)
					.get()
					.then((doc) => {
						const data = doc.data();

						setProfileData((prevData) => ({
							...prevData,
							at: data.at,
							name: data.name,
							follows: data.follows || [],
							followers: data.followers || [],
							bio: data.bio,
							id: doc.id,
							website: data.website,
							tweetAmount: data.tweets.length,
							joinDate: new Date(data.joinDate.seconds * 1000),
						}));
					});
	}, [
		userProfile,
		profileID,
		userImage,
		userAt,
		userID,
		userName,
		userBio,
		userJoinDate,
		userFollowers,
		userFollows,
		userTweets,
	]);

	// set header
	useEffect(() => {
		console.log("set header");

		!profileData.header &&
			storage
				.ref("header_pictures/" + profileID + ".png")
				.getDownloadURL()
				.then((url) => {
					setProfileData((prevData) => ({ ...prevData, header: url }));
				})
				.catch((e) => {
					console.log(e);
					setProfileData((prevData) => ({ ...prevData, header: EllipsisFilled }));
				});
	}, [profileID, profileData.header]);

	// set profile picture
	useEffect(() => {
		userProfile
			? // if it's the user's profile...
			  setProfileData((prevData) => ({ ...prevData, image: userImage }))
			: // if it's not...
			  storage
					.ref("profile_pictures/" + profileID + ".png")
					.getDownloadURL()
					.then((url) => {
						setProfileData((prevData) => ({ ...prevData, image: url }));
					})
					.catch((e) => {
						console.log(e);
						setProfileData((prevData) => ({ ...prevData, image: Leaf }));
					});
	}, [userProfile, userImage, profileID]);

	// if this isn't our own profile, are we following this user?
	useEffect(() => {
		console.log("set following");
		!userProfile && setFollowed(userFollows.includes(profileID));
	}, [userProfile, userFollows, profileID]);

	const toggleEditor = () => {
		setEditor(!editor);
	};

	const imageLoad = () => {
		console.log("image load");
		setImageLoaded(true);
	};

	return (
		<>
			<div className={`profile-header ${!imageLoaded && "hide"}`}>
				<Link
					to="/"
					className="profile-home-link"
					style={{ textDecoration: "none", color: "black" }}
				>
					<SideArrow />
					<div className="profile-home-link-text">
						<h3 className="no-dec">{profileData.name}</h3>
						<p className="grey">{profileData.tweetAmount} tweets</p>
					</div>
				</Link>
				<img
					className="profile-header-image"
					src={profileData.header}
					onLoad={imageLoad}
					alt="header"
				/>
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
						<FollowButton
							tweeterID={profileID}
							followed={followed}
							style={{ height: "3rem" }}
						/>
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
						<Link to={`${url}/following`} style={{ textDecoration: "none" }}>
							<span style={{ marginRight: "1rem" }}>
								{profileData.follows.length} <span className="grey">Following</span>
							</span>
						</Link>
						<Link to={`${url}/followers`} style={{ textDecoration: "none" }}>
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
					<ProfileFeed profileID={profileID} repliesIncluded={true} />
				</Route>

				<Route path={`${path}/media`}>
					<ProfileFeed profileID={profileID} repliesIncluded={false} />
				</Route>

				<Route path={`${path}/likes`}>
					<LikeFeed profileID={profileID} />
				</Route>

				<Route exact path={path}>
					<ProfileFeed profileID={profileID} />
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
