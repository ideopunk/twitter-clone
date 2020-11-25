import React from "react";

const Cover = (props) => {
	const handleClick = (e) => {
		e.stopPropagation();

		// if you're clicking inside the modal, don't fire.
		e.target.id === "cover" && props.toggle();
	};

	return (
		<div className="cover" id="cover" onClick={handleClick}>
			{props.children}
		</div>
	);
};

export default Cover;
