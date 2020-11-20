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
	const [followed, setFollowed] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {console.log(userProfile)}, [userProfile])
	// set profile data
	useEffect(() => {
		setProfileData({ follows: [], followers: [] });

		console.log("profileID:  " + profileID);
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

		// !profileData.header &&
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
		// profileData.header,
	]);


	// if this isn't our own profile, are we following this user?
	useEffect(() => {
		if (userID && userFollows) {
			!userProfile && setFollowed(userFollows.includes(profileID));
		}
	}, [userProfile, userFollows, profileID, userID]);

	useEffect(() => {
		if (editor) {
			document.body.style.position = "fixed"
		} else {
			document.body.style.position = ""
		}
	}, [editor])

	const toggleEditor = () => {
		setEditor(!editor);
	};

	const imageLoad = () => {
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
				<div style={{ height: "3.5rem" }}></div>

				<img
					className="profile-header-image"
					src={profileData.header}
					onLoad={imageLoad}
					alt="header"
				/>
				<div className="profile-card">
					<img className="main-image" src={profileData.image} alt="profile" />
					{userProfile ? (
						<div>
							<button
								className="btn profile-edit-button"
								style={{ width: "8rem" }}
								onClick={toggleEditor}
							>
								Edit profile
							</button>
						</div>
					) : (
						userID && (
							<FollowButton
								tweeterID={profileID}
								followed={followed}
								at={profileData.at}
								style={{ height: "3rem" }}
							/>
						)
					)}
					<div style={{ height: "3.5rem" }}></div>

					<h3>{profileData.name}</h3>
					<p className="grey">@{profileData.at}</p>
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
						<Link to={`${url}/following`} className="hover-under">
							<span style={{ marginRight: "1rem" }}>
								{profileData.follows.length} <span className="grey">Following</span>
							</span>
						</Link>
						<Link to={`${url}/followers`} className="hover-under">
							<span>
								{profileData.followers.length}{" "}
								<span className="grey">Followers</span>
							</span>
						</Link>
					</p>
				</div>
				<div className="profile-feed-selector-container">
					<NavLink
						exact
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
				<Route exact path={`${path}/with_replies`}>
					<ProfileFeed
						profileID={profileID}
						repliesIncluded={true}
						name={profileData.name}
					/>
				</Route>

				<Route exact path={`${path}/media`}>
					<ProfileFeed
						profileID={profileID}
						repliesIncluded={false}
						name={profileData.name}
					/>
				</Route>

				<Route exact path={`${path}/likes`}>
					<LikeFeed profileID={profileID} name={profileData.name} />
				</Route>

				<Route exact path={path}>
					<ProfileFeed profileID={profileID} name={profileData.name} />
				</Route>
			</Switch>
			{editor ? (
				<Cover toggle={toggleEditor}>
					<Editor
						header={profileData.header}
						bio={profileData.bio}
						website={profileData.website}
						toggle={toggleEditor}
					/>
				</Cover>
			) : (
				""
			)}
		</>
	);
};

export default ProfileMain;
