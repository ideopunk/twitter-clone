import React from "react";
import LoginPrompt from "../LoginPrompt";

const LoginCard = () => {
	return (
		<div className="login-card">
			<h3>New to Fake Twitter?</h3>
            <p>Sign up now to get your own personalized timeline!</p>
            <button className="log-in-button" style={{width: "100"}}>Sign up</button>
		</div>
	);
};

export default LoginCard;