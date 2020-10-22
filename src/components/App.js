import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { db, auth } from "../config/fbConfig";
import Main from "./Main";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import "../style/App.scss";

const App = () => {
	const [login, setLogin] = useState(false);

	return (
		<BrowserRouter>
			<div className="App">


				<Switch>
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/signup" component={SignupPage} />
					<Route path="/" component={Main} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
