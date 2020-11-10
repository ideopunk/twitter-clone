const elapser = (time) => {
	const elapsed = Date.now() - time.seconds * 1000;

	// if time is above a certain point, return Date.
	if (elapsed > 86400000) {
		const date = new Date(time.seconds * 1000);

		const today = new Date();
		const currentYear = today.getFullYear();
		const dateYear = date.getFullYear();

		if (dateYear !== currentYear) {
			return date.toDateString(4);
		} else {
			return date.toDateString().slice(4, 10);
		}
	} else if (elapsed > 3600000) {
		const hours = Math.round(elapsed / 3600000);
		return `${hours}h`;
	} else if (elapsed > 60000) {
		const minutes = Math.round(elapsed / 60000);
		return `${minutes}m`;
	} else {
		const seconds = Math.round(elapsed / 1000);
		return `${seconds}s`;
	}
};

export default elapser;
