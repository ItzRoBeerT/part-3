const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://robertocaravaca436:${password}@cluster0.95yvvrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (process.argv.length > 3) {
	const name = process.argv[3];
	const number = process.argv[4];

	const newPerson = new Phonebook({
		name,
		number,
	});

	newPerson.save().then((result) => {
		console.log(`Added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
} else {
	Phonebook.find({}).then((persons) => {
		persons.forEach((p) => console.log(p));
		mongoose.connection.close();
	});
}
