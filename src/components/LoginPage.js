import React from "react";

const LoginPage = () => {
	return (
		<div className="login-page">
			<h3>Log in to Fake Twitter</h3>
			<form>
				<label>
					Phone, email, or username
					<input />
				</label>
				<label>
					Password
					<input type="password" />
				</label>
				<input type="submit" value="Log in" />
				<div>
					<a href="#">Forgot password?</a>
                    <a href="#">Sign up for Fake Twitter</a>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
