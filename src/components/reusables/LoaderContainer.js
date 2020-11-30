import React from "react";
import Loader from "react-loader-spinner";

const LoaderContainer = (props) => {
	return (
		<div className="center" style={{ position: props.absolute ? "absolute" : "" }}>
			<Loader
				type="TailSpin"
				color="rgb(29, 242, 161)"
				height={100}
				width={100}
				timeout={3000} //3 secs
			/>
		</div>
	);
};

export default LoaderContainer;
