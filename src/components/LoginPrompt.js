import React from "react";
import { Link } from "react-router-dom";


const LoginPrompt = () => {
	return (
		<div className="login-prompt">
			<div className="login-prompt-text">
				<h3>Don't miss what's happening</h3>
				<p>People on Fake Twitter are the first to know.</p>
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
