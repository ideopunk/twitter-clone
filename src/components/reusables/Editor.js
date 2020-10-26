import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/context.js";
import { auth, db, storage } from "../../config/fbConfig";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";

const Editor = (props) => {
	const { header, bio, website } = props;
    const { userImage, userName, userAt, userID } = useContext(UserContext);
    
	const [name, setName] = useState("");
	const [newBio, setNewBio] = useState(bio);
	const [newWebsite, setNewWebsite] = useState(website);

	useEffect(() => {setName(userName)}, [userName]);

	const handleSubmit = (e) => {
		e.preventDefault();
		db.collection("users").doc(userID).update({ name: name, bio: newBio, website: newWebsite });

		// stuff for images
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleBioChange = (e) => {
		setNewBio(e.target.value);
	};

	const handleWebsiteChange = (e) => {
		setNewWebsite(e.target.value);
	};

	return (
		<form className="modal" onSubmit={handleSubmit}>
			<div className="editor-header">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<CloseIcon />
					<h3 style={{ height: "100%" }}>Edit profile</h3>
				</div>
				<input
					type="submit"
					className="btn"
					style={{ width: "3.5rem", height: "2rem" }}
					value="Save"
				/>
			</div>
			<img src={header} className="profile-header-image" alt="header" />
			<img src={userImage} className="profile-image main-image" alt="profile" />
			<div className="edit-form-text">
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
				<label className="form-label">
					<span className="form-name">Bio</span>
					<input
						className="form-input"
						placeholder="Add your bio"
						maxLength={160}
                        onChange={handleBioChange}
                        value={bio}
					/>
				</label>
				<label className="form-label">
					<span className="form-name">Website</span>
					<input
						className="form-input"
						placeholder="Add your website"
						maxLength={100}
                        onChange={handleWebsiteChange}
                        value={website}
					/>
				</label>
			</div>
		</form>
	);
};

export default Editor;
