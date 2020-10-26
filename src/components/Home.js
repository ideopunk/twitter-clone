import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Switch, NavLink } from "react-router-dom";

import Composer from "./reusables/Composer";
import FollowSuggests from "./reusables/FollowSuggests";
import Search from "./reusables/Search";
import TOS from "./reusables/TOS";
import Feed from "./reusables/Feed";
import LoginCard from "./reusables/LoginCard";

const Home = (props) => {
	const { userAt, userID, userImage } = props;

	return (
		<div className="home center-feed">
			<h3 className="home-title">Home</h3>
			<Composer />
			{/* <Feed /> */}
		</div>
	);
};

export default Home;
