import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Close } from "../../assets/close.svg";
import UserContext from "../context/context.js";
import ComposerCircle from "./ComposerCircle";
import LoaderContainer from "./LoaderContainer";
const reactStringReplace = require("react-string-replace");

const Toast = lazy(() => import("./Toast"));

const Composer = (props) => {
	const { modal, replyData, replyImage, toggle } = props;

	const { userName, userAt, userID, userImage, userTweets } = useContext(UserContext);

	const [text, setText] = useState("");
	const [dragOver, setDragOver] = useState(false);
	const [IMGs, setIMGs] = useState([]);
	const [previewIMGs, setPreviewIMGs] = useState([]);
	const [toast, setToast] = useState(false);

	const blueText = reactStringReplace(text, /([#@]\w*)/g, (match, i) => (
		<span key={i + match} className="hover-under begotten-link">
			{match}
		</span>
	));

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text || IMGs) {
			if (replyData) {
				const { tweetID } = replyData;
				import("../functions/reply.js").then((reply) =>
					reply.default({ tweetID, userName, userID, userAt, userTweets, text, IMGs })
				);
			} else {
				import("../functions/simpleTweet.js").then((simpleTweet) =>
					simpleTweet.default({ userName, text, userAt, userID, userTweets, IMGs })
				);
			}
			setText("");
			setIMGs([]);
			setPreviewIMGs([]);
			setToast("Your tweet was sent");
			if (toggle) {
				toggle();
			}
		}
	};

	const handleChange = (e) => {
		setText(e.target.value);
	};

	const handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		addImage(file);
		setDragOver(false);
		console.log(file);
		console.log(e.dataTransfer);
	};

	const handleUpload = (e) => {
		e.target.files[0] ? addImage(e.target.files[0]) : console.log("naw");
	};

	const addImage = (file) => {
		console.log(file);
		const names = IMGs.map((IMG) => IMG.name);
		if (IMGs.length > 3) {
			setToast("Please choose up to 4 photos.");
		} else if (names.includes(file.name)) {
			setToast("You've already uploaded that image!");
		} else {
			setIMGs((i) => [...i, file]);
		}
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

	// when an image is uploaded, create a preview.
	useEffect(() => {
		const removeImage = (name) => {
			console.log(name);
			console.log(IMGs);
			setIMGs((prev) => prev.filter((img) => img.name !== name));
			// setPreviewIMGs((prev) => prev.filter((img) => img.name !== name));
		};

		if (IMGs.length) {
			let tempArray = [];
			for (const img of IMGs) {
				const file = URL.createObjectURL(img);
				console.log(file);
				console.log(img);
				const jsx = (
					<div className="image-container" key={img.name} name={img.name}>
						<img
							src={file}
							alt="user-submitted-pic"
							className="composer-preview-image"
						/>
						<div className="img-close-container">
							<Close className="img-close" onClick={() => removeImage(img.name)} />
						</div>
					</div>
				);
				tempArray.push(jsx);
			}
			console.log(tempArray);
			setPreviewIMGs(tempArray);
		} else {
			setPreviewIMGs([]);
		}
	}, [IMGs]);

	useEffect(() => {
		console.log(previewIMGs);
	}, [previewIMGs]);

	useEffect(() => {
		let timer = null;
		if (toast) {
			timer = setTimeout(() => {
				setToast(false);
			}, 1000);
		}

		return () => clearTimeout(timer);
	}, [toast]);

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
							className={`composer-input composer-hide`}
							onChange={handleChange}
							onDrop={handleDrop}
							onPaste={handlePaste}
							placeholder="What's happening?"
							value={text}
						/>
						<div className="composer-input composer-mask">{blueText}</div>
						{previewIMGs.length > 1 ? (
							<div className="preview-images">
								<div className="preview-images-half">
									{previewIMGs.slice(0, Math.round(previewIMGs.length / 2))}
								</div>
								<div className="preview-images-half">
									{previewIMGs.slice(Math.round(previewIMGs.length / 2))}
								</div>
							</div>
						) : (
							<div className="preview-images">{previewIMGs}</div>
						)}
					</div>

					<div className="composer-options">
						<div className="composer-icon-div">
							<label htmlFor="picture-input">
								<Picture />
							</label>
							<input
								id="picture-input"
								className="hide"
								type="file"
								onChange={handleUpload}
							/>
						</div>
						<div className="composer-circle-container">
							{text && <ComposerCircle length={text.length} />}
						</div>
						<input
							className={`btn tweet-btn ${
								text || IMGs.length ? `active-button` : "no-hov"
							}`}
							style={{ width: "100px", marginLeft: "auto" }}
							type="submit"
							onClick={handleSubmit}
							value={replyData ? "Reply" : "Tweet"}
						/>
					</div>
				</div>
			</div>
			{toast ? (
				<Suspense fallback={<LoaderContainer />}>
					<Toast message={toast} />
				</Suspense>
			) : (
				""
			)}
		</form>
	);
};

export default Composer;
