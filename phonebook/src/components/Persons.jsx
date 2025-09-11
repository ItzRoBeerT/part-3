const Persons = ({ persons, handleDelete }) => {
	console.log('Rendering persons:', persons);

	return (
		<ul>
			{persons.map((person) => (
				<li key={person.id}>
					{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button>
				</li>
			))}
		</ul>
	);
};

export default Persons;
