import React from "react";

const Warning = ({title, message, cancel, action, actionName}) => {
	return (
		<div className="modal pad" style={{ textAlign: "center", maxWidth: "300px" }}>
			<h3 className="pad">{title}</h3>
			<p className="pad grey">
				{message}
			</p>
			<div className="flex pad" style={{ columnGap: "1rem" }}>
				<button className="btn grey-btn" onClick={cancel}>
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
