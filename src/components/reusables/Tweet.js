import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { db, storage } from "../../config/fbConfig";
import UserContext from "../context/context.js";
import Leaf from "../../assets/leaf-outline.svg";
import LoaderContainer from "./LoaderContainer";

import { ReactComponent as Quote } from "../../assets/quote-outline.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";
import { ReactComponent as Like } from "../../assets/like-icon.svg";
import { ReactComponent as LikeFilled } from "../../assets/like-icon-filled.svg";
import { ReactComponent as Copy } from "../../assets/copy-icon.svg";
import { ReactComponent as Dots } from "../../assets/dots.svg";
const Cover = lazy(() => import("./Cover"));
const Composer = lazy(() => import("./Composer"));

const Tweet = (props) => {
	const [image, setImage] = useState("");
	const [timeSince, setTimeSince] = useState(null);
	const [dropdown, setDropdown] = useState(false);
	const [reply, setReply] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	const {
		name,
		at,
		time,
		text,
		retweets,
		likes,
		replyAt,
		replyTo,
		replies,
		tweetID,
		tweeterID,
		big,
	} = props;
	const { userID, userAt, userLikes, userFollows, userTweets, userRetweets } = useContext(
		UserContext
	);

	const liked = likes && likes.includes(userID); // has the user liked this tweet?
	const followed = userFollows.includes(tweeterID); // does the user follow this tweet?
	const isRetweet = userRetweets.includes(tweetID);
	const likeAmount = likes ? likes.length : "";
	const retweetsAmount = retweets ? retweets.length : "";
	const repliesAmount = replies ? replies.length : "";
	const [retweetedBy, setRetweetedBy] = useState("");

	useEffect(() => {
		console.log(time);
	}, [time]);
	// is this a retweet?
	useEffect(() => {
		if (retweets) {
			if (retweets.includes(userID)) {
				setRetweetedBy(userAt);
			} else if (retweets.length > 0) {
				db.collection("users")
					.doc(retweets[retweets.length - 1])
					.get()
					.then((doc) => setRetweetedBy(doc.at));
			}
		}
	}, [retweets, userID, userAt]);

	// tweet rendered
	useEffect(() => {
		console.log("rendered");
	}, []);

	// get picture for tweet, set to Leaf if no picture found.
	useEffect(() => {
		storage
			.ref("profile_pictures/" + tweeterID + ".png")
			.getDownloadURL()
			.then((url) => {
				setImage(url);
			})
			.catch((err) => {
				console.log(err);
				setImage(Leaf);
			});

		//set how long ago the tweet was
		if (time) {
			import("../functions/elapser.js").then((elapser) =>
				setTimeSince(elapser.default(time))
			);
		}
	}, [tweeterID, time]);

	const toggleDropdown = () => {
		setDropdown(!dropdown);
	};

	const toggleReply = () => {
		setReply(!reply);
	};

	const deleteTweet = () => {
		import("../functions/deleteTweet.js").then((deleteTweet) =>
			deleteTweet.default(tweetID, userTweets, userID)
		);
	};

	const like = () => {
		import("../functions/likeDB.js").then((likeDB) =>
			likeDB.default(tweetID, userID, userLikes)
		);
	};

	const unlike = () => {
		import("../functions/unlike.js").then((unlike) =>
			unlike.default(tweetID, userID, userLikes)
		);
	};

	const follow = () => {
		import("../functions/follow.js").then((follow) =>
			follow.default(tweeterID, userID, userFollows)
		);
	};

	const unfollow = () => {
		import("../functions/unfollow.js").then((unfollow) =>
			unfollow.default(tweeterID, userID, userFollows)
		);
	};

	const retweet = () => {
		!userRetweets.includes(tweetID) &&
			import("../functions/retweet.js").then((retweet) =>
				retweet.default(tweetID, userID, userRetweets)
			);
	};

	const unRetweet = () => {
		import("../functions/unRetweet.js").then((unRetweet) => unRetweet.default(tweetID, userID));
	};

	const imageLoad = () => {
		setImageLoaded(true);
	};

	return (
		<div
			className={`tweet ${imageLoaded ? "" : "hide"} ${big ? "" : "pad"} ${
				replyTo ? "reply-tweet" : ""
			}`}
		>
			{retweetedBy && (
				<Link to={`/${retweetedBy}`} style={{ textDecoration: "none" }}>
					<div className="retweeted-by">
						<Retweet />
						<p>Retweeted by {retweetedBy}</p>
					</div>
				</Link>
			)}
			<div className={`tweet-inside ${big ? "big-tweet-inside" : ""}`}>
				<Link to={`/${at}`} style={{ textDecoration: "none" }}>
					{big ? (
						<div className="tweet-top-data pad">
							{image ? (
								<img
									className={`profile-image`}
									alt="user-profile"
									src={image}
									onLoad={imageLoad}
								/>
							) : (
								<div className="profile-image" />
							)}

							<span className="tweeter-name">{name}</span>
							<span className="tweeter-at">{at}</span>
							<span className="tweet-time grey">{timeSince}</span>
							<div style={{ marginLeft: "auto" }}>
								{dropdown && (
									<Dropdown
										deleteTweet={deleteTweet}
										unfollow={unfollow}
										follow={follow}
										followed={followed}
										tweetID={tweetID}
										userID={userID}
										tweeterID={tweeterID}
									/>
								)}
								<Dots className="dots" onClick={toggleDropdown} />
							</div>
						</div>
					) : image ? (
						<img
							className={`profile-image`}
							alt="user-profile"
							src={image}
							onLoad={imageLoad}
						/>
					) : (
						<div className="profile-image" />
					)}
				</Link>

				<Link
					to={`/tweet/${tweetID}`}
					className="tweet-main"
					style={{ textDecoration: "none", color: "black" }}
				>
					{!big && (
						<div className="tweet-top-data">
							<span className="tweeter-name">{name}</span>
							<span className="tweeter-at">{at}</span>
							<span className="tweet-time grey">{timeSince}</span>
							<div style={{ marginLeft: "auto" }}>
								{dropdown ? (
									<Dropdown
										deleteTweet={deleteTweet}
										unfollow={unfollow}
										follow={follow}
										followed={followed}
										tweetID={tweetID}
										userID={userID}
										tweeterID={tweeterID}
									/>
								) : (
									""
								)}
								<Dots className="dots" onClick={toggleDropdown} />
							</div>
						</div>
					)}
					{replyAt ? <p className="tweet-reply">Replying to {replyAt}</p> : ""}
					<p className={`tweet-text ${big ? "big-tweet-text" : ""}`}>{text}</p>

					{big && <p className="pad grey">{timeSince}</p>}

					{big && (
						<div className={`big-tweet-data`}>
							{retweetsAmount > 0 && (
								<p>
									<span className="bold">{retweetsAmount}</span>{" "}
									<span>retweet{retweetsAmount > 1 && "s"}</span>
								</p>
							)}
							{likeAmount > 0 && (
								<p>
									<span className="bold">{likeAmount}</span>{" "}
									<span>like{likeAmount > 1 && "s"}</span>
								</p>
							)}
						</div>
					)}
					<div className={`tweet-responses ${big ? "big-tweet-responses" : ""}`}>
						<div className="tweet-svg-div grey reply-div" onClick={toggleReply}>
							<Quote />
							{!big && repliesAmount}
						</div>
						<div
							className={`tweet-svg-div grey retweet-div ${
								isRetweet ? "active-retweet" : ""
							}`}
							onClick={isRetweet ? unRetweet : retweet}
						>
							<Retweet />
							{!big && retweetsAmount}
						</div>
						<div
							value={tweetID}
							className={`tweet-svg-div grey like-div ${liked && "liked"}`}
							onClick={liked ? unlike : like}
						>
							{liked ? <LikeFilled value={tweetID} /> : <Like value={tweetID} />}
							{!big && likeAmount}
						</div>
						<div className="tweet-svg-div grey">
							<Copy />
						</div>
					</div>
				</Link>
				{reply && (
					<Suspense fallback={<LoaderContainer />}>
						<Cover toggle={toggleReply}>
							<Composer
								modal={true}
								replyData={props}
								replyImage={image}
								replyTimeSince={timeSince}
							/>
						</Cover>
					</Suspense>
				)}
			</div>
		</div>
	);
};

const Dropdown = (props) => {
	const { followed, tweetID, userID, tweeterID } = props;
	const [userTweet, setUserTweet] = useState(false);

	useEffect(() => {
		userID === tweeterID && setUserTweet(true);
	}, [userID, tweeterID]);

	return userTweet ? (
		<div className="tweet-dropdown" value={tweetID} onClick={props.deleteTweet}>
			Delete this tweet
		</div>
	) : (
		<div
			className="tweet-dropdown"
			value={tweeterID}
			onClick={followed ? props.unfollow : props.follow}
		>
			{followed ? "Unfollow this account" : "Follow this account"}
		</div>
	);
};

export default Tweet;
