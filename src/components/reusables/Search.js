import React, { useState } from "react";

const Search = () => {
	const [searchPhrase, setSearchPhrase] = useState("");

	const handleChange = (e) => {
		setSearchPhrase(e.target.value);
	};

	const handleSubmit = (e) => {
		console.log(e.target.value);
	};

	return (
		<form className="search-form" onSubmit={(e) => handleSubmit(e)}>
			<label className="search-label">
				Search
				<input
                    className="search-input"
					placeholder="Search fake Twitter"
					value={searchPhrase}
					onChange={(e) => handleChange(e)}
				/>
			</label>
		</form>
	);
};

export default Search;
