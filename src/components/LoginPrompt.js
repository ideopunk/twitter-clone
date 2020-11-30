import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DeviceContext from "./context/deviceContext.js";

const LoginPrompt = () => {
	const { device } = useContext(DeviceContext);

	return (
		<div className="login-prompt">
			<div className="login-prompt-text">
				<h3>Don't miss what's happening</h3>
				{device !== "mobile" && <p>People on Fake Twitter are the first to know.</p>}
			</div>
			<div className="login-prompt-buttons">
				<Link className="btn lg-btn" to="/login">
					Log in
				</Link>
				<Link className="btn lg-btn sign-up-btn" to="/signup">
					Sign up
				</Link>
			</div>
		</div>
	);
};

export default LoginPrompt;
