import React, { lazy, Suspense, useState, useEffect } from "react";
import Tweet from "./reusables/Tweet";
import { Link, useParams } from "react-router-dom";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";

const Hashtag = () => {
	const { tag } = useParams();

	useEffect(() => {
		console.log(tag);
	}, [tag]);

	const [tweetDatas, setTweetDatas] = useState([]);

	return <div className="home center-feed"></div>;
};

export default Hashtag;
