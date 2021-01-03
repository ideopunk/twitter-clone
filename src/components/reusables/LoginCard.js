import React from "react";
import { Link } from "react-router-dom";

const LoginCard = () => {
	return (
		<div className="login-card">
			<h3>New to Fake Twitter?</h3>
			<p>Sign up now to get your own personalized timeline!</p>
			<Link to="/signup" className="btn no-dec" style={{ width: "100%" }}>
				Sign up
			</Link>
		</div>
	);
};

export default LoginCard;
