import React, { useState } from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Main from "./Main";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import "../style/App.scss";

const App = () => {
	const [user, setUser] = useState(null);

	// listen for auth status changes
	auth.onAuthStateChanged((user) => {
		console.log(user);
		if (!user) {
			setUser(null);
		} else {
			setUser(user.uid);
		}
	});

	return (
		<BrowserRouter>
			<div className="App">
				{!user ? (
					<Switch>
						<Route exact path="/login">
							{user ? <Redirect to="/" /> : <LoginPage />}
						</Route>
						<Route exact path="/signup">
							{user ? <Redirect to="/" /> : <SignupPage />}
						</Route>
						<Route path="/">
							<Main user={user} />
						</Route>
					</Switch>
				) : (
					<Switch>
						<Route path="/">
							<Main user={user} />
						</Route>
					</Switch>
				)}
			</div>
		</BrowserRouter>
	);
};

export default App;
