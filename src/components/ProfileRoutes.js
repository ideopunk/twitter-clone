import React, { useState, useEffect, useContext } from "react";
import { Link, Switch, Route, useRouteMatch, NavLink } from "react-router-dom";
import { db } from "../config/fbConfig";
import UserContext from "./context/userContext.js";
import LoaderContainer from "./reusables/LoaderContainer";
import ProfileMain from "./ProfileMain";
import ProfileFollows from "./ProfileFollows";
import NotFound from "./NotFound";

const ProfileRoutes = () => {
	const { userAt, userID } = useContext(UserContext);

	const { path, url, params } = useRouteMatch();
	const urlAt = params.profile;

	const [userProfile, setUserProfile] = useState(null);
	const [profileID, setProfileID] = useState(null);

	// figure out if this is a real user. If not, 404 them.
	useEffect(() => {
		if (userAt === urlAt) {
			setProfileID(userID);
			setUserProfile(true);
		} else {
			setUserProfile(false);
			db.collection("users")
				.where("at", "==", urlAt)
				.get()
				.then((snapshot) => {
					if (snapshot.size > 0) {
						snapshot.forEach((doc) => {
							setProfileID(doc.id);
						});
					} else {
						setProfileID(404);
					}
				});
		}
	}, [urlAt, userID, userAt]);

	useEffect(() => {
		console.log(profileID);
	}, [profileID]);

	return (
		<div className="profile center-feed">
			{profileID ? (
				profileID !== 404 ? (
					<Switch>
						<Route path={`${path}/following`}>
							<ProfileFollows profileID={profileID} userProfile={userProfile} />
						</Route>
						<Route path={`${path}/followers`}>
							<ProfileFollows profileID={profileID} userProfile={userProfile} />
						</Route>
						<Route path={path}>
							<ProfileMain profileID={profileID} userProfile={userProfile} />
						</Route>
					</Switch>
				) : (
					<NotFound at={urlAt} />
				)
			) : (
				<LoaderContainer />
			)}
		</div>
	);
};

export default ProfileRoutes;
