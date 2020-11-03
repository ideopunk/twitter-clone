import React, { useContext, useEffect, useState } from "react";

const ComposerCircle = ({ length }) => {
	const [sda, setSDA] = useState("");
	const [stroke, setStroke] = useState("rgb(29, 242, 161)");
	const r = 10;
	const circleLength = 2 * Math.PI * r;

	useEffect(() => {
		let colored = (circleLength * length) / 280;
		let grey = circleLength - colored;

		if (280 - length <= 0) {
			setStroke("red");
		} else if (280 - length <= 20) {
			setStroke("orange");
		} else {
			setStroke("rgb(29, 242, 161)");
        }
        
		setSDA(`${colored} ${grey}`);
	}, [length, circleLength]);

	return (
        <>
		<svg>
			<circle className="grey-circle" cx="50%" cy="50%" r="10" />
			<circle
				className="color-circle"
				cx="50%"
				cy="50%"
				r="10"
				style={{ stroke: stroke, strokeDasharray: sda, strokeDashoffset: "75%" }}
			/>
		</svg>
        {length > 259 && <p className="circle-warning">{280 - length}</p> }
        </>
	);
};

export default ComposerCircle;
