import React, { useEffect, useState, useContext } from "react";
import { db } from "../config/fbConfig";
import DeviceContext from "./context/deviceContext.js";
import UserContext from "./context/userContext.js";

import Feed from "./reusables/Feed";
import LoaderContainer from "./reusables/LoaderContainer";
import Search from "./reusables/Search";
import MobileProfileLink from "./reusables/MobileProfileLink";

const Explore = () => {
	const { userID } = useContext(UserContext);

	const { device } = useContext(DeviceContext);

	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Explore / Fake Twitter";
	}, []);

	useEffect(() => {
		setTweetDatas([]);

		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.limit(25)
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					const doc = change.doc;

					if (change.type === "removed") {
						deletionArray.push(doc.id);
					}
				});

				// don't include replies
				snapshot.forEach((doc) => {
					if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id });
					}
				});

				setTweetDatas(tempArray.filter((doc) => !deletionArray.includes(doc.id)));
			});

		return () => unsub();
	}, []);

	return (
		<div className="center-feed">
			<div className="pad top-link">
				{device === "mobile" && userID && <MobileProfileLink />}
				<Search className="pad" />
			</div>
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Explore;
