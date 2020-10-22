import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, NavLink } from "react-router-dom";

import Composer from "./reusables/Composer";
import FollowSuggests from "./reusables/FollowSuggests";
import Search from "./reusables/Search";
import TOS from "./reusables/TOS";
import Menu from "./Menu";
import Tweet from "./reusables/Tweet";
import Feed from "./reusables/Feed";
import LoginCard from "./reusables/LoginCard";

const Home = () => {
	return (
		<div className="main">
			<div className="home">
				<h3 className="home-title">Home</h3>
				<Composer />
				<Feed />
			</div>
			<div className="sidebar">
				<Search />
				<LoginCard />
				<FollowSuggests />
				<TOS />
			</div>


		</div>
	);
};

export default Home;
