import React, { useEffect, useState } from "react";
import { db } from "../config/fbConfig";
import Feed from "./reusables/Feed";
import LoaderContainer from "./reusables/LoaderContainer";
import Search from "./reusables/Search";

const Explore = () => {
	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		document.title = "Explore / Fake Twitter";
	}, []);

	useEffect(() => {
		setTweetDatas([]);

		const unsub = db
			.collection("tweets")
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				let tempArray = [];
				let deletionArray = [];
				const changes = snapshot.docChanges();

				changes.forEach((change) => {
					console.log(change.type);
					const doc = change.doc;

					// don't include replies
					if (change.type === "removed") {
						deletionArray.push(doc.id);
					}
				});

				snapshot.forEach((doc) => {
					if (!doc.data().replyTo) {
						tempArray.push({ ...doc.data(), id: doc.id});
					}
				});

				setTweetDatas(tempArray.filter((doc) => !deletionArray.includes(doc.id)));
			});

		return () => unsub();
	}, []);

	// useEffect(() => {
	// 	setTweetDatas([]);

	// 	const unsub = db
	// 		.collection("tweets")
	// 		.orderBy("timeStamp", "desc")
	// 		.onSnapshot((snapshot) => {
	// 			let tempArray = [];
	// 			let deletionArray = [];
	// 			const changes = snapshot.docChanges();

	// 			changes.forEach((change) => {
	// 				console.log(change.type);
	// 				const doc = change.doc;

	// 				// don't include replies
	// 				if (change.type === "removed") {
	// 					deletionArray.push(doc.id);
	// 				} else if (!doc.data().replyTo) {
	// 					tempArray.push({ ...doc.data(), id: doc.id, type: change.type });
	// 				}
	// 			});

	// 			setTweetDatas((t) =>
	// 				[...t, ...tempArray].filter((doc) => !deletionArray.includes(doc.id))
	// 			);
	// 		});

	// 	return () => unsub();
	// }, []);

	return (
		<div className="explore center-feed">
			<div className="pad side-box-title">
				<Search className="pad" />
			</div>
			{tweetDatas.length ? <Feed tweetDatas={tweetDatas} /> : <LoaderContainer />}
		</div>
	);
};

export default Explore;
