import React from "react"
import Loader from "react-loader-spinner";


const LoaderContainer = () => {
	return (
		<div className="center">
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