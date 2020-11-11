import React, { useEffect, useState } from "react";
import AccountCard from "./AccountCard";
import { db } from "../../config/fbConfig";
import LoaderContainer from "./LoaderContainer";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";

const UsersList = ({ tweetID, type }) => {
	const [accounts, setAccounts] = useState([]);

	useEffect(() => {
		db.collection("users")
			.where(type, "array-contains", tweetID)
			.get()
			.then((snapshot) => {
				let accountDatas = [];
				snapshot.forEach((account) => {
					const data = account.data();
					accountDatas.push(
						<AccountCard
							key={account.id}
							bio={data.bio}
							id={account.id}
							name={data.name}
							at={data.at}
						/>
					);
				});

				setAccounts(accountDatas);
			});
	}, [tweetID, type]);

	return (
		<div className="modal">
			<div
				className="modal-header"
			>
				<CloseIcon />
				<h3>
					{type === "retweets" ? "Retweeted by" : "Liked by"}
				</h3>
			</div>
			{accounts.length ? accounts : <LoaderContainer />}
		</div>
	);
};

export default UsersList;
