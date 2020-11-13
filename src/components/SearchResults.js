import React, { useState, Suspense, lazy, useEffect } from "react";
import { db } from "../config/fbConfig";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";
import Search from "./reusables/Search";
import { Link, useParams } from "react-router-dom";
import LoaderContainer from "./reusables/LoaderContainer";
const Feed = lazy(() => import("./reusables/Feed"));

const SearchResults = () => {
	const { searchTerm } = useParams();
	const [tweetDatas, setTweetDatas] = useState([]);

	// doc title
	useEffect(() => {
		document.title = `${searchTerm} - Search`;
	}, [searchTerm]);

	// search!
	useEffect(() => {
		setTweetDatas([]);
		db.collection("tweets")
			.where("hashtags", "array-contains", searchTerm)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				setTweetDatas((t) => [...t, ...tempArray]);
			});

		db.collection("tweets")
			.where("at", "==", searchTerm)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				setTweetDatas((t) => [...t, ...tempArray]);
			});

		db.collection("tweets")
			.where("name", "==", searchTerm)
			.get()
			.then((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					tempArray.push({ ...doc.data(), id: doc.id });
				});
				setTweetDatas((t) => [...t, ...tempArray]);
			});
	}, [searchTerm]);

	return (
		<div className="home center-feed">
			{" "}
			<div className="profile-home-link">
				<Link to="/" style={{ textDecoration: "none", color: "black" }}>
					<SideArrow />
				</Link>
				<div className="pad" style={{ width: "100%" }}>
					<Search defaultValue={searchTerm} />
				</div>
			</div>
			<div style={{ height: "4.75rem" }}></div>
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

export default SearchResults;
