import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { db, storage } from "../../config/fbConfig";
import UserContext from "../context/context.js";
import Leaf from "../../assets/leaf-outline.svg";
import LoaderContainer from "./LoaderContainer";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ReactComponent as Quote } from "../../assets/quote-outline.svg";
import { ReactComponent as Retweet } from "../../assets/retweet-icon.svg";
import { ReactComponent as Like } from "../../assets/like-icon.svg";
import { ReactComponent as LikeFilled } from "../../assets/like-icon-filled.svg";
import { ReactComponent as Copy } from "../../assets/copy-icon.svg";
import { ReactComponent as Dots } from "../../assets/dots.svg";

const Cover = lazy(() => import("./Cover"));
const Composer = lazy(() => import("./Composer"));
const UsersList = lazy(() => import("./UsersList"));
const TweetDropdown = lazy(() => import("./TweetDropdown"));
const reactStringReplace = require("react-string-replace");
const Toast = lazy(() => import("./Toast"));

const Tweet = (props) => {
	const [image, setImage] = useState("");
	const [timeSince, setTimeSince] = useState(null);
	const [dropdown, setDropdown] = useState(false);
	const [reply, setReply] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [modal, setModal] = useState("");
	const [toast, setToast] = useState("");
	const [deleteToast, setDeleteToast] = useState(false);

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
	const followed = userFollows && userFollows.includes(tweeterID); // does the user follow this tweet?
	const isRetweet = userRetweets && userRetweets.includes(tweetID);
	const likeAmount = likes ? likes.length : "";
	const retweetsAmount = retweets ? retweets.length : "";
	const repliesAmount = replies ? replies.length : "";
	const [retweetedBy, setRetweetedBy] = useState("");

	const hashedText = reactStringReplace(text, /(#\w+)/g, (match, i) => (
		<Link
			to={`/hashtag/${match.slice(1)}`}
			key={i + match}
			className="hover-under"
			style={{ color: "rgb(29, 242, 161)" }}
		>
			{match}
		</Link>
	));
	const linkedText = reactStringReplace(hashedText, /(@\w+)/g, (match, i) => (
		<Link
			to={`/${match.slice(1)}`}
			key={i + match}
			className="hover-under"
			style={{ color: "rgb(29, 242, 161)" }}
		>
			{match}
		</Link>
	));

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
		if (time && !big) {
			import("../functions/elapser.js").then((elapser) =>
				setTimeSince(elapser.default(time))
			);
		} else if (time && big) {
			setTimeSince(new Date(time.seconds * 1000).toDateString());
		}
	}, [tweeterID, time, big]);

	const toggleDropdown = (e) => {
		console.log("toggle dropdown");
		e.stopPropagation();
		if (userID) {
			setDropdown(!dropdown);
		}
	};

	const toggleReply = () => {
		if (userID) {
			setReply(!reply);
		}
	};

	const deleteTweet = () => {
		if (userID) {
			import("../functions/deleteTweet.js").then((deleteTweet) =>
				deleteTweet.default(tweetID, userTweets, userID)
			);
		}
		setDeleteToast(true);
	};

	const like = () => {
		if (userID) {
			import("../functions/likeDB.js").then((likeDB) =>
				likeDB.default(tweetID, userID, userLikes)
			);
		}
	};

	const unlike = () => {
		if (userID) {
			import("../functions/unlike.js").then((unlike) =>
				unlike.default(tweetID, userID, userLikes)
			);
		}
	};

	const follow = () => {
		if (userID) {
			import("../functions/follow.js").then((follow) =>
				follow.default(tweeterID, userID, userFollows)
			);
		}
	};

	const unfollow = () => {
		if (userID) {
			import("../functions/unfollow.js").then((unfollow) =>
				unfollow.default(tweeterID, userID, userFollows)
			);
		}
	};

	const retweet = () => {
		if (userID) {
			!userRetweets.includes(tweetID) &&
				import("../functions/retweet.js").then((retweet) =>
					retweet.default(tweetID, userID, userRetweets)
				);
		}
	};

	const unRetweet = () => {
		if (userID) {
			import("../functions/unRetweet.js").then((unRetweet) =>
				unRetweet.default(tweetID, userID)
			);
		}
	};

	// toasts last one second.

	useEffect(() => {
		let timer = null;
		if (toast) {
			timer = setTimeout(() => {
				setToast(false);
			}, 1000);
		}

		return () => clearTimeout(timer);
	}, [toast]);

	// toasts last one second.
	useEffect(() => {
		let timer = null;
		if (deleteToast) {
			timer = setTimeout(() => {
				setDeleteToast(false);
			}, 6000);
		}

		return () => clearTimeout(timer);
	}, [deleteToast]);

	const imageLoad = () => {
		setImageLoaded(true);
	};

	return (
		<div
			// className={`tweet ${imageLoaded ? "" : "hide"} ${big ? "" : "pad"} ${replyTo ? "reply-tweet" : ""}`}
			className={`tweet ${imageLoaded ? "" : "hide"} ${big ? "" : "pad"} `}
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
				{big ? (
					<div className="tweet-top-data pad">
						<Link to={`/${at}`}>
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
						</Link>
						<Link to={`/${at}`} style={{ textDecoration: "none" }}>
							<p className="tweeter-name">{name}</p>
							<p className="tweeter-at">@{at}</p>
						</Link>

						<div style={{ marginLeft: "auto", position: "relative" }}>
							<Dots className="dots grey" onClick={(e) => toggleDropdown(e)} />
							{dropdown && (
								<Suspense fallback={<LoaderContainer />}>
									<TweetDropdown
										deleteTweet={deleteTweet}
										unfollow={unfollow}
										follow={follow}
										followed={followed}
										tweetID={tweetID}
										userID={userID}
										tweeterID={tweeterID}
										toggle={toggleDropdown}
									/>
								</Suspense>
							)}
						</div>
					</div>
				) : image ? (
					<Link to={`/${at}`}>
						<img
							className={`profile-image`}
							alt="user-profile"
							src={image}
							onLoad={imageLoad}
						/>
					</Link>
				) : (
					<Link to={`/${at}`}>
						<div className="profile-image" />
					</Link>
				)}

				<div className="tweet-main">
					{!big && (
						<div className="tweet-top-data">
							<Link to={`/${at}`} style={{ textDecoration: "none" }}>
								<span className="tweeter-name hover-under">{name}</span>
								<span className="tweeter-at hover-under">{`@${at}`}</span>
							</Link>
							<Link
								to={`/tweet/${tweetID}`}
								style={{ textDecoration: "none", color: "black" }}
							>
								<span className="tweet-time hover-under grey">{timeSince}</span>
							</Link>
							<div style={{ marginLeft: "auto", position: "relative" }}>
								<Dots className="dots" onClick={toggleDropdown} />
								{dropdown && (
									<Suspense fallback={<LoaderContainer />}>
										<TweetDropdown
											deleteTweet={deleteTweet}
											unfollow={unfollow}
											follow={follow}
											followed={followed}
											tweetID={tweetID}
											userID={userID}
											tweeterID={tweeterID}
											toggle={toggleDropdown}
										/>{" "}
									</Suspense>
								)}
							</div>
						</div>
					)}
					{replyAt ? <p className="tweet-reply">Replying to @{replyAt}</p> : ""}
					<p className={`tweet-text ${big ? "big-tweet-text" : ""}`}> {linkedText}</p>

					{big && <p className="pad grey">{timeSince}</p>}

					{big && (
						<div className={`big-tweet-data`}>
							{retweetsAmount > 0 && (
								<p onClick={() => setModal("retweets")} className="hover-under">
									<span className="bold">{retweetsAmount}</span>{" "}
									<span>retweet{retweetsAmount > 1 && "s"}</span>
								</p>
							)}
							{likeAmount > 0 && (
								<p onClick={() => setModal("likes")} className="hover-under">
									<span className="bold">{likeAmount}</span>{" "}
									<span>like{likeAmount > 1 && "s"}</span>
								</p>
							)}
						</div>
					)}

					<div className={`tweet-responses ${big ? "big-tweet-responses" : ""}`}>
						<div className="tweet-svg-div grey reply-div" onClick={toggleReply}>
							<div className="tweet-svg-holder">
								<Quote />
							</div>
							{!big && (repliesAmount || "")}
						</div>
						<div
							className={`tweet-svg-div grey retweet-div ${
								isRetweet ? "active-retweet" : ""
							}`}
							onClick={isRetweet ? unRetweet : retweet}
						>
							<div className="tweet-svg-holder">
								<Retweet />
							</div>
							{!big && (retweetsAmount || "")}
						</div>
						<div
							value={tweetID}
							className={`tweet-svg-div grey like-div ${liked && "liked"}`}
							onClick={liked ? unlike : like}
						>
							<div className="tweet-svg-holder">
								{liked ? <LikeFilled value={tweetID} /> : <Like value={tweetID} />}
							</div>
							{!big && (likeAmount || "")}
						</div>
						<div className="tweet-svg-div grey copy-div">
							<CopyToClipboard text={`/tweet/${tweetID}`}>
								<div className="tweet-svg-holder" onClick={() => setToast(true)}>
									<Copy />
								</div>
							</CopyToClipboard>
						</div>
					</div>
				</div>
				{reply && (
					<Suspense fallback={<LoaderContainer />}>
						<Cover toggle={toggleReply}>
							<Composer
								modal={true}
								replyData={props}
								replyImage={image}
								replyTimeSince={timeSince}
								toggle={toggleReply}
							/>
						</Cover>
					</Suspense>
				)}
			</div>
			{modal ? (
				<Suspense fallback={<LoaderContainer />}>
					<Cover toggle={() => setModal("")}>
						<UsersList type={modal} tweetID={tweetID} clear={() => setModal("")} />{" "}
					</Cover>
				</Suspense>
			) : (
				""
			)}
			{toast ? (
				<Suspense fallback={<LoaderContainer />}>
					<Toast message="Tweet copied" />
				</Suspense>
			) : (
				""
			)}
			{deleteToast ? (
				<Suspense fallback={<LoaderContainer />}>
					<Toast message="Your Tweet was deleted wahh" />
				</Suspense>
			) : (
				""
			)}
		</div>
	);
};

export default Tweet;
