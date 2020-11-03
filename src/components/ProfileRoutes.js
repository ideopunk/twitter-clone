import React, { useState, useEffect, useContext } from "react";
import { Link, Switch, Route, useRouteMatch, NavLink } from "react-router-dom";
import Feed from "./reusables/Feed";
import LikeFeed from "./reusables/LikeFeed";
import { db } from "../config/fbConfig";
import UserContext from "./context/context.js";
import LoaderContainer from "./reusables/LoaderContainer";
import ProfileMain from "./ProfileMain";

const ProfileRoutes = () => {
	const { userAt, userID } = useContext(UserContext);

	const { path, url, params } = useRouteMatch();
	const urlAt = params.profile;

	const [userProfile, setUserProfile] = useState(null);
	const [profileID, setProfileID] = useState(null);

	useEffect(() => {
		if (userAt === urlAt) {
			setProfileID(userID);
			setUserProfile(true);
		} else {
			db.collection("users")
				.where("at", "==", urlAt)
				.get()
				.then((snapshot) => {
					snapshot.forEach((doc) => {
						console.log(doc);
						setProfileID(doc.id);
					});
				});
		}
	}, [urlAt, userID, userAt]);

	console.log(path, url, params);
	return (
		<div className="profile center-feed">
			{profileID ? (
				<Switch>
					<Route path={`${path}/following`}>
						<ProfileMain profileID={profileID} userProfile={userProfile} />
					</Route>
					<Route path={`${path}/followers`}>
						<ProfileMain profileID={profileID} userProfile={userProfile} />
					</Route>
					<Route path={path}>
						<ProfileMain profileID={profileID} userProfile={userProfile} />
					</Route>
				</Switch>
			) : (
				<LoaderContainer />
			)}
		</div>
	);
};

export default ProfileRoutes;
