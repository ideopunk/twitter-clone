import React, { useEffect, useState } from "react";

// credit to Alessia Miccoli
// https://itnext.io/how-to-create-a-twitter-inspired-character-counter-with-an-svg-progress-ring-react-js-352f3c8eefbc
const ComposerCircle = ({ length }) => {
	const [sda, setSDA] = useState("");
    const [stroke, setStroke] = useState("rgb(29, 242, 161)");
    const [r, setR] = useState(10)

	useEffect(() => {
        if (length > 259) {
            setR(15)
        } else {
            setR(10)
        }
    	const circleLength = 2 * Math.PI * r;
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
	}, [length, r]);

	return (
        <>
		<svg style={{width: length > 259? "2rem" : "1.5rem", height: length > 259? "2rem" : "1.5rem"}}>
			<circle className="grey-circle" cx="50%" cy="50%" r={r} />
			<circle
				className="color-circle"
				cx="50%"
				cy="50%"
				r={r}
				style={{ stroke: stroke, strokeDasharray: sda, strokeDashoffset: "75%" }}
			/>
		</svg>
        {length > 259 && <p className="circle-warning">{280 - length}</p> }
        </>
	);
};

export default ComposerCircle;
