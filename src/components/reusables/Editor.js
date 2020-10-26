import React, { useState, useContext } from "react";
import UserContext from "../context/context.js";
import {ReactComponent as CloseIcon}  from "../../assets/close.svg"

const Editor = (props) => {
	const {
		userImage,
		userHeader,
		userName,
		userAt,
		userID,
		userFollows,
		userFollowers,
	} = useContext(UserContext);

	const { header } = props;

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="modal">
			<div className="editor-header">
				<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<CloseIcon/>
                    <h3 style={{height: "100%"}}>Edit profile</h3>
				</div>
				<button className="btn" style={{ width: "3.5rem", height: "2rem" }}>
					Save
				</button>
			</div>
			<img src={header} className="profile-header-image" alt="header" />
			<img src={userImage} className="profile-image main-image" alt="profile" />
			<form className="edit-form" onSubmit={handleSubmit}>
				<label className="form-label">
					<span className="form-name">Name</span>
					<input className="form-input" placeholder="Add your name" maxLength={50} />
				</label>
				<label className="form-label">
					<span className="form-name">Bio</span>
					<input className="form-input" placeholder="Add your bio" maxLength={160} />
				</label>
				<label className="form-label">
					<span className="form-name">Website</span>
					<input className="form-input" placeholder="Add your website" maxLength={100} />
				</label>
			</form>
		</div>
	);
};

export default Editor;
