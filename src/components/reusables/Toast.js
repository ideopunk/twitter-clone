import React, { useEffect } from "react";

function Toast({message}) {
	useEffect(() => {
		let toasts = document.getElementsByClassName("toast");
		for (let toast of toasts) {
			setTimeout(() => toast.classList.add("transition"), 0);
			setTimeout(() => toast.classList.add("hide"), 1000);
		}
	});

	return (
		<div className="toast">
			{message}
		</div>
	);
}

export default Toast;
