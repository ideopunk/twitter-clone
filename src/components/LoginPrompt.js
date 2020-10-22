import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";


const LoginPrompt = () => {
	return (
		<div className="login-prompt">
			<div className="login-prompt-text">
				<h3>Don't miss what's happening</h3>
				<p>People on Fake Twitter are the first to know.</p>
			</div>
			<div className="login-prompt-buttons">
				<Link className="lg-btn log-in-button" to="/login">
					Log in
				</Link>
				<Link className="lg-btn sign-up-button" to="/signup">
					Sign up
				</Link>
			</div>

		</div>
	);
};

export default LoginPrompt;
