import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Close } from "../../assets/close.svg";
import UserContext from "../context/context.js";
import ComposerCircle from "./ComposerCircle";

const Composer = (props) => {
	const { modal, replyData, replyImage, toggle } = props;

	const { userName, userAt, userID, userImage, userTweets } = useContext(UserContext);

	const [text, setText] = useState("");
	const [dragOver, setDragOver] = useState(false);
	const [IMG, setIMG] = useState(null);
	const [previewIMG, setPreviewIMG] = useState(null);

	// when an image is uploaded, create a preview.
	useEffect(() => {
		if (IMG) {
			const file = URL.createObjectURL(IMG);
			console.log(file);
			setPreviewIMG(file);
		}
	}, [IMG]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("hand sub");
		if (replyData) {
			const { tweetID } = replyData;
			import("../functions/reply.js").then((reply) =>
				reply.default({ tweetID, userName, userID, userAt, userTweets, text, IMG })
			);
		} else {
			console.log(text);
			import("../functions/simpleTweet.js").then((simpleTweet) =>
				simpleTweet.default({ userName, text, userAt, userID, userTweets, IMG })
			);
		}
		setText("");
		if (toggle) {
			toggle();
		}
	};

	const handleChange = (e) => {
		console.log(e);
		console.log(e.target.childNodes);

		console.log(window.getSelection());
		// did they add an image?
		e.target.childNodes.forEach((node) => {
			console.log(node.nodeType);
			console.log(node.tagName);
			console.log(node.src);
			if (node.tagName === "IMG") {
				setIMG(node.src);
			}
		});

		console.log(e.target.textContent);
		setText(e.target.value);
		// setText(e.target.textContent);
	};

	const handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		setIMG(file);
		setDragOver(false);
		console.log(file);
		console.log(e.dataTransfer);
	};

	const handleDragOver = (e) => {
		if (!dragOver) {
			setDragOver(true);
		}
	};

	const handlePaste = (e) => {
		e.stopPropagation();
		e.preventDefault();
		console.log(e.target);
		console.log(e.dataTransfer);
	};

	const handleDragLeave = () => {
		console.log("drag leave");
		setDragOver(false);
	};

	const removeImage = () => {
		setIMG(null)
		setPreviewIMG(null)
	}
	return (
		<form className={`${modal ? `modal` : ""} ${replyData ? "" : "composer"}`}>
			{replyData && (
				<div className="composer" style={{ border: "0" }}>
					<img src={replyImage} alt="user-profile" className="profile-image" />
					<div className="tweet-main">
						<div className="tweet-top-data">
							<span className="tweeter-name">{replyData.name}</span>
							<span className="tweeter-at">{replyData.at}</span>
							<span className="tweet-time grey">{replyData.timeSince}</span>
						</div>
						<p className="tweet-text">{replyData.text}</p>
						<p>
							Replying to <Link to={`/${replyData.at}`}>{replyData.at}</Link>
						</p>
					</div>
				</div>
			)}
			<div className={replyData ? "composer" : "flex"}>
				<Link to={`/${userAt}`}>
					<img src={userImage} alt="user-profile" className="profile-image" />
				</Link>
				<div className="composer-right">
					<div
						className={`composer-input-container ${dragOver ? "drag-over" : ""}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						<input
							type="text"
							className={`composer-input`}
							onChange={handleChange}
							onDrop={handleDrop}
							onPaste={handlePaste}
							placeholder="What's happening?"
							value={text}
						/>

						{previewIMG ? (
							<div className="composer-image-container">
								<img
									src={previewIMG}
									alt="user-submitted-pic"
									className="composer-preview-image"
								/>
								<div className="img-close-container">
									<Close className="img-close" onClick={removeImage} />
								</div>
							</div>
						) : (
							""
						)}
					</div>

					<div className="composer-options">
						<div className="composer-icon-div">
							<Picture />
						</div>
						<div className="composer-circle-container">
							{text && <ComposerCircle length={text.length} />}
						</div>
						<input
							className={`btn tweet-btn ${text ? `active-button` : ""}`}
							style={{ width: "100px", marginLeft: "auto" }}
							type="submit"
							onClick={handleSubmit}
							value={replyData ? "Reply" : "Tweet"}
						/>
					</div>
				</div>
			</div>
		</form>
	);
};

export default Composer;
