import React, { lazy, Suspense, useState, useEffect } from "react";
import Tweet from "./reusables/Tweet";
import { Link, useParams, useLocation } from "react-router-dom";
import { ReactComponent as SideArrow } from "../assets/side-arrow-icon.svg";

import Leaf from "../assets/leaf-outline.svg";

import { db, storage } from "../config/fbConfig";
import LoaderContainer from "./reusables/LoaderContainer";
const Feed = lazy(() => import("./reusables/Feed"));

const TweetAndReplies = (props) => {
	const { tweetID } = useParams();
	const [mainTweet, setMainTweet] = useState({});
	const [tweetDatas, setTweetDatas] = useState([]);
	const [image, setImage] = useState("");
	const location = useLocation();

	useEffect(() => {
		if (Object.keys(mainTweet).length > 0) {
			document.title = `${mainTweet.name} on Fake Twitter`;
		}
	}, [mainTweet]);

	// get the tweet, get the image
	useEffect(() => {
		db.collection("tweets")
			.doc(tweetID)
			.onSnapshot((doc) => {
				const data = doc.data();
				setMainTweet({ ...data, id: doc.id });
				storage
					.ref("profile_pictures/" + data.userID + ".png")
					.getDownloadURL()
					.then((url) => {
						setImage(url);
					})
					.catch(() => {
						setImage(Leaf);
					});
			});
	}, [tweetID]);

	// get the replies
	useEffect(() => {
		db.collection("tweets")
			.where("replyTo", "==", tweetID)
			.onSnapshot((snapshot) => {
				let tempArray = [];
				snapshot.forEach((doc) => {
					// don't include replies
					tempArray.push({ ...doc.data(), id: doc.id });
				});

				setTweetDatas(tempArray);
			});
	}, [tweetID]);

	return (
		<div className="home center-feed">
			<Link
				to={location.state ? location.state.prevPath : "/"}
				className="top-link"
				style={{ textDecoration: "none", color: "black" }}
			>
				<div className="tweet-svg-holder">
					<SideArrow />
				</div>
				<div className="top-link-text">
					<h3 className="no-dec">Tweet</h3>
				</div>
			</Link>
			<Tweet
				key={mainTweet.id}
				tweetID={mainTweet.id}
				tweeterID={mainTweet.userID}
				name={mainTweet.name}
				at={mainTweet.at}
				time={mainTweet.timeStamp}
				text={mainTweet.text}
				retweets={mainTweet.retweets}
				replyTo={mainTweet.replyTo}
				likes={mainTweet.likes}
				getReplies={false}
				replies={mainTweet.replies}
				big={true}
				image={image}
				imageCount={mainTweet.imageCount}
			/>
			{mainTweet.replies && mainTweet.replies.length ? (
				<Suspense fallback={<LoaderContainer />}>
					<Feed tweetDatas={tweetDatas} noOriginal={true} />
				</Suspense>
			) : (
				""
			)}
		</div>
	);
};

export default TweetAndReplies;
