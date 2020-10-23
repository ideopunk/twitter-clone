import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Main from "./Main";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import "../style/App.scss";

const App = () => {
	const [userID, setUserID] = useState(null);
	const [userData, setUserData] = useState(null)

	// listen for auth status changes
	useEffect(() => {
		console.log('use effect')
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (!user) {
				setUserID(null);
			} else {
				setUserID(user.uid);
			}
			
		});
	}, [])
	

	return (
		<BrowserRouter>
			<div className="App">
				<Switch>
					<Route exact path="/login">
						{userID ? <Redirect to="/" /> : <LoginPage />}
					</Route>
					<Route exact path="/signup">
						{userID ? <Redirect to="/" /> : <SignupPage />}
					</Route>
					<Route path="/">
						<Main userID={userID} />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default App;
