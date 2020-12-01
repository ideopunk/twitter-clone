import React, { useEffect, useState } from "react";
import AccountCard from "./AccountCard";
import { useRouteMatch } from "react-router-dom";
import { db } from "../../config/fbConfig";
import LoaderContainer from "./LoaderContainer";

const AccountList = ({ profileID, name }) => {
	const { url } = useRouteMatch();
	console.log(useRouteMatch());

	const [accounts, setAccounts] = useState([]);

	useEffect(() => {
		if (url.includes("following")) {
			document.title = `People following ${name}`;
		} else {
			document.title = `People followed by ${name}`;
		}
	}, [name, url]);

	useEffect(() => {
		db.collection("users")
			.where(url.includes("following") ? "followers" : "follows", "array-contains", profileID)
			.get()
			.then((snapshot) => {
				let accountDatas = [];
				snapshot.forEach((account) => {
					const data = account.data();
					if (account.id !== profileID) {
						accountDatas.push(
							<AccountCard
								key={account.id}
								id={account.id}
								name={data.name}
								at={data.at}
							/>
						);
					}
				});

				setAccounts(accountDatas);
			});
	});

	return <div className="feed">{accounts.length ? accounts : <LoaderContainer />}</div>;
};

export default AccountList;
