require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const User = require('./models/user');

const app = express();
app.use(express.static('dist')); // Serve static files from the 'dist' directory
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => {
	if (req.method === 'POST' && req.body) {
		return JSON.stringify(req.body);
	}
	return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
	User.find({}).then((users) => {
		response.json(users);
	});
});

app.get('/info', async (request, response) => {
	const total_people = await User.countDocuments({});
	const current_time = new Date();

	response.send(`
    Phonebook has info for ${total_people} people 
    <br/>
    ${current_time}`);
});

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	console.log(id);
	
	User.findById(id)
		.then((person) => {
			response.json(person);
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	User.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => {
			next(error);
		});
});

app.post('/api/persons', (request, response, next) => {
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

		User.findOne({ name: personData.name })
			.then((existingUser) => {
				if (existingUser) {
					return response.status(400).json({
						error: 'Name must be unique',
					});
				}

				const user = new User({
					name: personData.name,
					number: personData.number,
				});
				user.save().then((savedUser) => {
					response.json(savedUser);
				});
			})
			.catch((error) => {
				next(error);
			});
	}
});

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	const { name, number } = request.body;

	User.findByIdAndUpdate(id, { name, number }, { new: true })
		.then((updatedUser) => {
			console.log('updatedUser', updatedUser);

			response.json(updatedUser);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.log('nombre del error', error.name);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
