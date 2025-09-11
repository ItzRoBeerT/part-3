import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
	return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
	return axios.post(baseUrl, newObject).then((response) => response.data);
};

const deletePerson = (id) => {
	return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

const updatePerson = (id, newPerson) => {
	return axios
		.put(`${baseUrl}/${id}`, newPerson)
		.then((response) => response.data)
		.catch((error) => {
			console.error('Error updating person:', error);
		});
};

export default { getAll, create, deletePerson, updatePerson };
