const nullToNumber = async (input) => {
	console.log('nullToNumber');
	const convertedInput = () => {
		if (input === null || input === 'null') {
			return 0;
		}
		return input;
	};
	console.log('CONVERTED INPUT ' + convertedInput);

	return {
		result: convertedInput,
	};
};

export default nullToNumber;
