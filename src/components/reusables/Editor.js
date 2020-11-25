import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/context.js";
import { auth, db, storage } from "../../config/fbConfig";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as CameraIcon } from "../../assets/camera-icon.svg";
const Editor = (props) => {
	const { header, bio, website, toggle } = props;
	const { userImage, userName, userID } = useContext(UserContext);

	const [name, setName] = useState(userName);
	const [newBio, setNewBio] = useState(bio);
	const [newWebsite, setNewWebsite] = useState(website);
	const [newProPic, setNewProPic] = useState(userImage);
	const [newHeader, setNewHeader] = useState(header);

	const [picChanged, setPicChanged] = useState(false);
	const [headerChanged, setHeaderChanged] = useState(false);

	useEffect(() => {
		console.log(name);
		console.log(newBio);
		console.log(newWebsite);
	}, [name, newBio, newWebsite]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(newHeader, newProPic);
		db.collection("users")
			.doc(userID)
			.update({ name: name || "", bio: newBio || "", website: newWebsite || "" })
			.then(() =>
				import("../functions/updateName.js").then((updateName) =>
					updateName.default(userID, name)
				)
			)
			.then(() => {
				if (picChanged) {
					const profileRef = storage.ref("profile_pictures/" + userID + ".png");
					const uploadTask = profileRef.put(newProPic);
					uploadTask.on(
						"state_changed",

						// how it's going
						(snapshot) => {},

						// how it goofed it
						(error) => {
							console.log(error);
						},

						// how it succeeded
						() => {
							console.log("success");
						}
					);
				}
			})
			.then(() => {
				if (headerChanged) {
					const headerRef = storage.ref("header_pictures/" + userID + ".png");
					const uploadTask = headerRef.put(newHeader);
					uploadTask.on(
						"state_changed",

						// how it's going
						(snapshot) => {},

						// how it goofed it
						(error) => {
							console.log(error);
						},

						// how it succeeded
						() => {
							console.log("success");
						}
					);
				}
			});

		// stuff for images
	};

	const handleNameChange = (e) => {
		console.log("setname");
		setName(e.target.value);
	};

	const handleBioChange = (e) => {
		setNewBio(e.target.value);
	};

	const handleWebsiteChange = (e) => {
		setNewWebsite(e.target.value);
	};

	const handleHeaderPicChange = (e) => {
		console.log(e.target.files[0]);
		e.target.files[0] ? setNewHeader(e.target.files[0]) : console.log("naw");
		setHeaderChanged(true);
	};

	const handleProfilePicChange = (e) => {
		e.target.files[0] ? setNewProPic(e.target.files[0]) : console.log("naw");
		setPicChanged(true);
	};

	return (
		<form className="modal" onSubmit={handleSubmit} style={{top: "2rem"}}>
			<div className="modal-header">
				<CloseIcon onClick={() => toggle()} />
				<h3>Edit profile</h3>
				<input
					type="submit"
					className="btn"
					style={{
						width: "3.5rem",
						height: "2rem",
						marginLeft: "auto",
						marginRight: "1rem",
					}}
					value="Save"
				/>
			</div>
			<div className="header-container">
				<img src={newHeader} className="profile-header-image" alt="header" />
				<div className="header-icons">
					<label htmlFor="header-input">
						<CameraIcon />
					</label>
					<input id="header-input" type="file" onChange={handleHeaderPicChange} />
				</div>
			</div>
			<div className="edit-form-text">
				<div>
					<img src={newProPic} className="main-image" alt="profile" />
					<label htmlFor="profile-pic-input">
						<CameraIcon className="main-image main-image-camera" />
					</label>
					<input id="profile-pic-input" type="file" onChange={handleProfilePicChange} />
				</div>

				<label className="form-label">
					<span className="form-name">Name</span>
					<input
						className="form-input"
						placeholder="Add your name"
						maxLength={50}
						onChange={handleNameChange}
						value={name}
					/>
				</label>
				<div className="form-length">
					<span>{name ? name.length : 0}/50</span>
				</div>
				<label className="form-label">
					<span className="form-name">Bio</span>
					<input
						className="form-input"
						placeholder="Add your bio"
						maxLength={160}
						onChange={handleBioChange}
						value={newBio}
					/>
				</label>
				<div className="form-length">
					<span>{newBio ? newBio.length : 0}/160</span>
				</div>
				<label className="form-label">
					<span className="form-name">Website</span>
					<input
						className="form-input"
						placeholder="Add your website"
						maxLength={100}
						onChange={handleWebsiteChange}
						value={newWebsite}
					/>
				</label>
				<div className="form-length">
					<span>{newWebsite ? newWebsite.length : 0}/100</span>
				</div>
			</div>
		</form>
	);
};

export default Editor;
