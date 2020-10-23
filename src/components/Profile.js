import React, { useState, useEffect } from "react";
import Feed from "./reusables/Feed";
import { db } from "../config/fbConfig";

const Profile = (props) => {
	const { userID } = props;
	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		db.collection("tweets")
			.where("userID", "==", userID)
			.orderBy("timeStamp")
			.limit(50)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					console.log(doc.data());
					console.log(doc.id);
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				return tempArray;
			})
			.then((tempArray) => {
				setTweetDatas(tempArray);
			});
	}, [userID]);

	return (
		<div>
			<Feed tweetDatas={tweetDatas} />
		</div>
	);
};

export default Profile;
