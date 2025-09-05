const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('tiny'));
const PORT = process.env.PORT || 3001;

let data = [
	{
		id: '1',
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: '2',
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: '3',
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: '4',
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

const generateId = () => {
	const maxId = Math.max(...data.map((person) => Number(person.id)));

	return maxId + 1;
};

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
	response.send(data);
});

app.get('/info', (request, response) => {
	const total_people = data.length;
	const current_time = new Date();

	response.send(`
    Phonebook has info for ${total_people} people 
    <br/>
    ${current_time}`);
});

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	console.log(id);
	const person = data.find((person) => person.id === id);

	if (!person) {
		return response.status(400).json({
			error: "Id doesn't exists",
		});
	} else response.send(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = data.find((person) => person.id === id);

	if (!person) {
		return response.status(400).json({
			error: "Id doesn't exists",
		});
	} else {
		data = data.filter((person) => person.id !== id);
		response.status(200).json({
			success: `${person.name} has been deleted successfully!`,
			persons: data,
		});
	}
});

app.post('/api/persons', (request, response) => {
	const personData = request.body;

	if (!personData) {
		response.status(400).json({
			error: 'No content found!',
		});
	} else {
		if (!personData.name || !personData.number) {
			return response.status(400).json({
				error: 'Name or Number is missing',
			});
		}

		const personExists = data.find((person) => person.name === personData.name);

		if (personExists) {
			return response.status(400).json({
				error: 'Name must be unique',
			});
		}

		const newPerson = {
			...personData,
			id: generateId(),
		};
		data = data.concat(newPerson);
		console.log('Persons', data);
		response.json(newPerson);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
