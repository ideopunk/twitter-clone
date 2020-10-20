import React, { useState, useEffect } from "react";
import Composer from "./reusables/Composer";
import FollowSuggests from "./reusables/FollowSuggests";
import Search from "./reusables/Search";
import TOS from "./reusables/TOS";
import Tweet from "./reusables/Tweet";
import Feed from "./reusables/Feed";

const Home = () => {
	return (
		<div className="main">
			<div className="home"><Composer /><Feed /></div>
            <div className="sidebar"><Search /><FollowSuggests /><TOS /></div>
		</div>
	);
};

export default Home;
