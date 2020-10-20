import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";

const TOS = () => {
	return (
		<div>
			<BrowserRouter>
				<Link className="TOS-link">Terms of Service</Link>
				<Link className="TOS-link">Privacy Policy</Link>
				<Link className="TOS-link">Cookie Policy</Link>
				<Link className="TOS-link">Ads info</Link>
				<Link className="TOS-link">More</Link>
				<Link className="TOS-link">
					This site is not twitter. It is a portfolio item for{" "}
					<a href="https://github.com/ideopunk">Conor Barnes</a>
				</Link>
				<Switch>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default TOS;
