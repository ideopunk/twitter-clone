import React, { lazy, Suspense, useState, useEffect } from "react";
import { db } from "../config/fbConfig";

import { Link, useParams } from "react-router-dom";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";
import Search from "./reusables/Search";
import LoaderContainer from "./reusables/LoaderContainer";
const Feed = lazy(() => import("./reusables/Feed"));

const Hashtag = () => {
	const { tag } = useParams();

	useEffect(() => {
		console.log(tag);
	}, [tag]);

	const [tweetDatas, setTweetDatas] = useState([]);

	useEffect(() => {
		db.collection("tweets")
			.where("hashtags", "array-contains", tag)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				setTweetDatas(tempArray);
			});
	}, [tag]);

	return (
		<div className="home center-feed">
			<div className="top-link">
				<Link to="/" style={{ textDecoration: "none", color: "black" }}>
					<SideArrow />
				</Link>
				<div className="top-link-text">
					<Search defaultValue={"#" + tag} />
				</div>
			</div>
			<div style={{ height: "3.5rem" }}></div>
			{tweetDatas.length ? (
				<Suspense fallback={<LoaderContainer />}>
					<Feed tweetDatas={tweetDatas} />
				</Suspense>
			) : (
				<LoaderContainer />
			)}
		</div>
	);
};

export default Hashtag;
