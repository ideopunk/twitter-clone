import React, { useState, useEffect, useContext } from "react";
import { auth, db, storage } from "../config/fbConfig";
import UserContext from "./context/context.js";

import Composer from "./reusables/Composer";
import FollowSuggests from "./reusables/FollowSuggests";
import Search from "./reusables/Search";
import TOS from "./reusables/TOS";
import Feed from "./reusables/Feed";
import LoginCard from "./reusables/LoginCard";

const Home = (props) => {
	const { userImage, userName, userAt, userID, userFollows, userFollowers } = useContext(
		UserContext
	);

	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		db.collection("users")
			.where("follows", "array-contains", userID)
			.get()
			.then((snapshot) => {
				console.log(snapshot);
				let tempArray = [];

				// for each user we follow...
				snapshot.forEach((doc) => {
					console.log(doc.data());
					console.log(doc.data().tweets);
					doc.data().tweets && tempArray.push(...doc.data().tweets);
				});
				return tempArray;
			})
			.then((tempArray) => {
				db.collection("tweets")
					.orderBy("timeStamp", "desc")
					.get()
					.then((snapshot) => {
						console.log(snapshot);
						console.log(tempArray);
						let finalArray = [];
						snapshot.forEach((doc) => {
							tempArray.includes(doc.id) &&
								finalArray.push({ ...doc.data(), id: doc.id });
						});
						console.log(finalArray);
						setTweetDatas(finalArray);
					});
			});
	}, [userID]);

	return (
		<div className="home center-feed">
			<h3 className="home-title">Home</h3>
			<Composer />
			<Feed tweetDatas={tweetDatas} />
		</div>
	);
};

export default Home;
