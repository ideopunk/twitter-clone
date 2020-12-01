import React, { useState, useEffect, useContext } from "react";
import { db } from "../config/fbConfig";

import UserContext from "./context/userContext.js";
import DeviceContext from "./context/deviceContext.js";
import LoaderContainer from "./reusables/LoaderContainer";

import Composer from "./reusables/Composer";
import Feed from "./reusables/Feed";
import MobileProfileLink from "./reusables/MobileProfileLink";

const arraysMatch = (arr1, arr2) => {
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;
}

const Home = () => {
	const { userFollows } = useContext(UserContext);
	const [stopperUserFollows, setStopperUserFollows] = useState([]);
	const { device } = useContext(DeviceContext);
	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Home / Fake Twitter";
	}, []);

	useEffect(() => {
		console.log(stopperUserFollows)
		console.log(userFollows)

		if (userFollows && (!arraysMatch(stopperUserFollows, userFollows))) {
			console.log("setting stopperuserfollows")
			setStopperUserFollows(userFollows);
		}
	}, [userFollows, stopperUserFollows]);

	useEffect(() => {
		setTweetDatas([]);

		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				console.log("home snapshot");
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					if (change.type === "removed") {
						deletionArray.push(change.doc.id);
					}
				});
				snapshot.forEach((doc) => {
					const data = doc.data();

					// include non-replies from follows
					if (!data.replyTo && stopperUserFollows.includes(data.userID)) {
						tempArray.push({ ...doc.data(), id: doc.id });
						// include replies from follows if you also follow the original tweeter.
					} else if (stopperUserFollows.includes(data.replyUserID)) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});
				setTweetDatas(tempArray.filter((doc) => !deletionArray.includes(doc.id)));
			});
		return () => unsub();
	}, [stopperUserFollows]);

	return (
		<div className="home center-feed">
			<h3 className="top-link">
				{device === "mobile" && <MobileProfileLink />}
				Home
			</h3>
			{device === "comp" && <Composer />}
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Home;
