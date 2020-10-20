import React from "react";

const Composer = () => {
	return (
		<form className="composer">
			<img src="#" alt="user-profile" className="img-left" />
			<div className="compose-right">
				<input maxLength={240} required className="compose-input" />
				<div className="compose-options">
					<img alt=""/>
					<img alt="" />
					<img alt="" />
					<img alt="" />
					<img alt="" />
					<input type="submit" value="Tweet" placeholder="What's happening?" />
				</div>
			</div>
		</form>
	);
};

export default Composer;
