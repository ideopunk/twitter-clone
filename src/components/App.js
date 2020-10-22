import React, { useState } from "react";
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom";
import { db, auth } from "../config/fbConfig";
import Main from "./Main";
import LoginPrompt from "./LoginPrompt";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import "../style/App.scss";

function App() {
	const [login, setLogin] = useState(false);

	return (
		<BrowserRouter>
			<div className="App">
				<Main />
				{!login ? <LoginPrompt /> : ""}

				<Switch>
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/signup" component={SignupPage} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
