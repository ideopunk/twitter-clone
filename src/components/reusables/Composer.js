import React, { useContext, useEffect, useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Close } from "../../assets/close.svg";
import UserContext from "../context/userContext.js";
import ComposerCircle from "./ComposerCircle";
import LoaderContainer from "./LoaderContainer";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";

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
	const [line, setLine] = useState(false);

	useEffect(() => {
		if (modal) {
			setLine(true);
		}
	}, [modal]);

	const redText = (
		<p key="red">
			{text.slice(0, 280)}
			{text.length > 279 && <span className="too-long">{text.slice(280)}</span>}
		</p>
	);

	const blueText = reactStringReplace(redText, /([#@]\w*)/g, (match, i) => (
		<span key={i + match} className="hover-under begotten-link">
			{match}
		</span>
	));

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text || IMGs) {
			if (replyData) {
				const { tweetID, tweeterID } = replyData;
				import("../functions/reply.js").then((reply) =>
					reply.default({
						tweetID,
						tweeterID,
						userName,
						userID,
						userAt,
						userTweets,
						text,
						IMGs,
					})
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
		// e.stopPropagation();
		// e.preventDefault();
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
		let timer = null;
		if (toast) {
			timer = setTimeout(() => {
				setToast(false);
			}, 1000);
		}

		return () => clearTimeout(timer);
	}, [toast]);

	const inputEl = useRef(null);

	// focus cursor
	useEffect(() => {
		modal && inputEl.current.focus();
	}, [modal]);

	return (
		// <form className={`${modal ? `modal` : ""} ${replyData ? "" : "composer"}`}>
		<form className={`${modal ? `modal` : "composer"}`}>
			{modal && (
				<div className="modal-header">
					<CloseIcon onClick={() => toggle()} />
				</div>
			)}
			{replyData && (
				<div className="composer" style={{ border: "0" }}>
					<div className="profile-image grey-line">
						<img src={replyImage} alt="user-profile" className="profile-image" />
					</div>
					<div className="tweet-main">
						<div className="tweet-top-data">
							<span className="tweeter-name">{replyData.name}</span>
							<span className="tweeter-at">@{replyData.at}</span>
							<span className="tweet-time grey">{replyData.timeSince}</span>
						</div>
						<p className="tweet-text">{replyData.text}</p>
						<p className="grey">
							Replying to{" "}
							<Link to={`/${replyData.at}`} className="begotten-link">
								@{replyData.at}
							</Link>
						</p>
					</div>
				</div>
			)}
			<div
				className={modal ? "composer" : "flex"}
				style={{ paddingTop: replyData ? "3px" : "0rem" }}
			>
				<Link to={`/${userAt}`} className={`profile-image`}>
					<img src={userImage} alt="user-profile" className="profile-image" />
				</Link>
				<div className="composer-right">
					<div
						className={`composer-input-container ${dragOver ? "drag-over" : ""}`}
						style={{ borderBottom: line ? "" : 0 }}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						<textarea
							className={`composer-input composer-hide`}
							// hack
							rows={Math.round(text.length / 70) + 1}
							onClick={() => setLine(true)}
							onChange={handleChange}
							onDrop={handleDrop}
							onPaste={handlePaste}
							placeholder={replyData ? "Tweet your reply" : "What's happening?"}
							ref={inputEl}
							value={text}
							style={{ resize: "none", overflow: "auto" }}
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
							previewIMGs.length > 0 && (
								<div className="preview-images">{previewIMGs}</div>
							)
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
