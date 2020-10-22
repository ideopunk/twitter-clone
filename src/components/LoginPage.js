import React, {useState} from "react";

const LoginPage = () => {
	const [user, setUser] = useState("")
	const [password, setPassword] = useState("")

	const handleUserChange = (e) => {
		setUser(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}

	const handleSubmit = () => {
		console.log(user, password)
	}

	return (
		<div className="login-page">
			<h3>Log in to Fake Twitter</h3>
			<form>
				<label>
					Phone, email, or username
					<input onChange={(e) => handleUserChange(e)}/>
				</label>
				<label>
					Password
					<input type="password" onChange={(e) => handlePasswordChange(e)}/>
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
