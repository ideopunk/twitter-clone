import React, { useContext, useEffect, useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Picture } from "../../assets/picture-icon.svg";
import { ReactComponent as Close } from "../../assets/close.svg";
import UserContext from "../context/userContext.js";
import ComposerCircle from "./ComposerCircle";
import LoaderContainer from "./LoaderContainer";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";

// import reply from "../functions/reply.js";
// import simpleTweet from "../functions/simpleTweet.js";

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
	const [bonusRows, setBonusRows] = useState(0);

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
		if ((text || IMGs) && text.length < 281) {
			if (replyData) {
				const { tweetID, tweeterID } = replyData;
				// reply(tweetID, tweeterID, userName, userID, userAt, userTweets, text, IMGs);
				import("../functions/reply.js")
					.then((reply) =>
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
					)
					.then(() => {
						setText("");
						setIMGs([]);
						setPreviewIMGs([]);
						setToast("Your tweet was sent");
					})
					.catch((err) => console.log(err));
			} else {
				// simpleTweet({ userName, text, userAt, userID, userTweets, IMGs });
				import("../functions/simpleTweet.js")
					.then((simpleTweet) =>
						simpleTweet.default({ userName, text, userAt, userID, userTweets, IMGs })
					)
					.then(() => {
						setText("");
						setIMGs([]);
						setPreviewIMGs([]);
						setToast("Your tweet was sent");
					})
					.catch((err) => console.log(err));
			}

			if (toggle) {
				toggle();
			}
		}
	};

	const handleChange = (e) => {
		if (e.target.scrollHeight > e.target.offsetHeight + 5) {
			setBonusRows((n) => n + 1);
		} else if (e.target.value.length < 30) {
			setBonusRows(0);
		} else if (e.target.value.length + 40 < text.length) {
			setBonusRows((n) => n - 1);
		}
		setText(e.target.value);
	};

	const handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		addImage(file);
		setDragOver(false);
	};

	const handleUpload = (e) => {
		e.target.files[0] ? addImage(e.target.files[0]) : console.log("naw");
	};

	const addImage = (file) => {
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

	const handleDragLeave = () => {
		setDragOver(false);
	};

	// when an image is uploaded, create a preview.
	useEffect(() => {
		const removeImage = (name) => {
			setIMGs((prev) => prev.filter((img) => img.name !== name));
		};

		if (IMGs.length) {
			let tempArray = [];
			for (const img of IMGs) {
				const file = URL.createObjectURL(img);
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
		<form className={`${modal ? `modal` : "composer"}`}>
			{modal && (
				<div className="modal-header">
					<CloseIcon onClick={() => toggle()} />
				</div>
			)}
			{replyData && (
				<div className="composer grey-line" style={{ border: "0" }}>
					<div className="profile-image ">
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
				style={{ paddingTop: replyData ? "3px" : "1rem", border: modal ? "0" : "" }}
			>
				<Link to={`/${userAt}`} className={`profile-image`}>
					<img
						src={userImage}
						alt="user-profile"
						className={`profile-image ${userImage ? "" : "transparent"}`}
					/>
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
							resize="none"
							rows={1 + bonusRows}
							onClick={() => setLine(true)}
							onChange={handleChange}
							onDrop={handleDrop}
							placeholder={replyData ? "Tweet your reply" : "What's happening?"}
							ref={inputEl}
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
								(text || IMGs.length) && text.length < 281
									? `active-button`
									: "no-hov"
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
