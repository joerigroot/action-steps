import { ExportToCsv } from 'export-to-csv';
const exportToCSV = async ({
	collectionInput,
	delimiter,
	useBom,
	exportProperties,
	model: { name: modelName },
	property: [{ name: propertyName }],
}) => {
	let keys = exportProperties.split(',');
	const filteredData = collectionInput.data.map((item) => {
		return Object.fromEntries(
			Object.entries(item).filter(([key]) =>
				keys.some((el) => key.includes(el))
			)
		);
	});
	return {
		reference: await storeFile(modelName, propertyName, {
			contentType: 'text/csv',
			extension: 'csv',
			fileName: `${modelName}-export`,
			fileBuffer: stringToBuffer(
				new ExportToCsv({
					fieldSeparator: delimiter,
					quoteStrings: '"',
					decimalSeparator: '.',
					showLabels: true,
					showTitle: false,
					useTextFile: false,
					useBom: useBom,
					useKeysAsHeaders: true,
				}).generateCsv(filteredData, true)
			),
		}),
	};
};

export default exportToCSV;
