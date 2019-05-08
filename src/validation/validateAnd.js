export default rules => (...args) => {
	for (const rule of rules) {
		const result = rule(...args);
		if (result) {
			return result;
		}
	}
	return null;
};
