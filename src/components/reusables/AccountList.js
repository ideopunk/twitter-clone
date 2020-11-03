import React from "react";
import AccountCard from "./AccountCard";

const AccountList = ({ accountDatas }) => {
	const accounts = accountDatas.map((account) => {
		return (
			<AccountCard
				key={account.id}
				bio={account.bio}
				id={account.id}
				name={account.name}
                at={account.at}
			/>
		);
	});

	return <div className="feed">{accounts}</div>;
};

export default AccountList;
