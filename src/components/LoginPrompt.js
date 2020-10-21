import React from "react";

const LoginPrompt = () => {
	return (
		<div className="login-prompt">
			<div className="login-prompt-text">
				<h3>Don't miss what's happening</h3>
                <p>People on Fake Twitter are the first to know.</p>
			</div>
            <div className="login-prompt-buttons">
                <button className="lg-btn log-in-button">Log in</button>
                <button className="lg-btn sign-up-button">Sign up</button>
            </div>
		</div>
	);
};

export default LoginPrompt;
