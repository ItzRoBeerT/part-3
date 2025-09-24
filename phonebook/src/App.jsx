import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import phoneService from './services/phonebook';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filter, setFilter] = useState('');
	const [userAdded, setUserAdded] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		console.log('Effect');
		phoneService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const addNumber = (event) => {
		event.preventDefault();

		const newPerson = {
			name: newName,
			number: newNumber,
		};

		const personExists = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());
		console.log('personExists', personExists);

		if (!personExists) {
			phoneService.create(newPerson).then((response) => {
				setPersons([...persons, response]);
				setNewName('');
				setNewNumber('');
				console.log('Person added:', response);
				setUserAdded(`Added ${response.name}`);
			});
		} else {
			if (personExists.number !== newPerson.number) {
				if (
					window.confirm(
						`${personExists.name} is already added to phonebook, replace the old number with the new one`
					)
				) {
					phoneService
						.updatePerson(personExists.id, newPerson)
						.then((updatedPerson) => {
							console.log('updated Person', updatedPerson);

							setPersons(
								persons.map((person) => (person.id === updatedPerson.id ? updatedPerson : person))
							);
							setNewName('');
							setNewNumber('');
						})
						.catch((error) => {
							console.error('Error updating person:', error);
							setError(`Error updating person: ${error.message}, he is probably not in the phonebook`);
						});
				}
			} else alert(`${newName} is already added to phonebook`);
		}
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	const handleDelete = (id) => {
		window.confirm('Are you sure you want to delete this contact?') &&
			phoneService.deletePerson(id).then(() => {
				setPersons(persons.filter((person) => person.id !== id));
			});
	};

	const filteredNumbers = filter ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLocaleLowerCase())) : persons;

	console.log('Filtered numbers:', filteredNumbers);
	console.log('filter', filter);
	console.log('All persons:', persons);

	return (
		<div>
			<h2>Phonebook</h2>
			{userAdded && <h3 className="success">{userAdded}</h3>}
			{error && <h3 className="error">{error}</h3>}

			<Filter filter={filter} onChange={handleFilterChange} />

			<h3>Add a new</h3>

			<PersonForm
				onSubmit={addNumber}
				newName={newName}
				newPhone={newNumber}
				onNameChange={handleNameChange}
				onPhoneChange={handleNumberChange}
			/>

			<h3>Numbers</h3>
			<Persons persons={filteredNumbers} handleDelete={handleDelete} />
		</div>
	);
};

export default App;
