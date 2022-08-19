import { parseAssignedProperties, fetchRecord } from '../../utils';

const createJoeri = async ({ model: { name: modelName }, mapping }) => {
	const assignProperties = parseAssignedProperties(mapping);

	const currentCollection = `
		{
			allProject {
				results {
					id
				}
			}
		}
	`;

	let currentData = await gql(currentCollection, {});
	const projects = currentData.data.allProject.results;
	const newArray = projects.map((item, index) => {
		return item.id;
	});

	const input = {
		...assignProperties,
		projects: { id: newArray },
	};

	console.log('INPUT: ' + JSON.stringify(input));

	const mutationName = `create${modelName}`;

	const mutation = `
	mutation($input: ${modelName}Input) {
		${mutationName}(input: $input) {
			id
		}
	}
`;

	console.log('MUTATION: ', mutation);

	const { data, errors } = await gql(mutation, { input });
	if (errors) {
		throw errors;
	}

	const {
		[mutationName]: { id },
	} = data;
	const createdRecord = await fetchRecord(modelName, id, mapping);

	return {
		as: createdRecord,
	};
};

export default createJoeri;
