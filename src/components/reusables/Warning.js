import React from "react";

const Warning = ({title, message, cancel, action, actionName}) => {
	return (
		<div className="modal pad" style={{ textAlign: "center"}}>
			<h3 className="pad">{title}</h3>
			<p className="pad grey">
				{message}
			</p>
			<div className="flex pad" >
				<button className="btn grey-btn" onClick={cancel} style={{marginRight: "1rem"}}>
					Cancel
				</button>
				<button className="btn" onClick={action}>
                    {actionName}
				</button>
			</div>
		</div>
	);
};

export default Warning;
