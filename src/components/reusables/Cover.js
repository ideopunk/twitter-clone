import React from "react";

const Cover = (props) => {
	const handleClick = (e) => {
		e.stopPropagation();
		console.log(e.target.id);
		e.target.id === "cover" && props.toggleComposer();
    };
    
	return (
		<div className="cover" id="cover" onClick={handleClick}>
			{props.children}
		</div>
	);
};

export default Cover;
