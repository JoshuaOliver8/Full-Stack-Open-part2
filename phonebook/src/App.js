import { useState, useEffect } from 'react'
import personsService from './services/persons'

const Search = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input 
        value={searchName}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const NewPerson = ({ newName, handleNameChange, 
  newNumber, handleNumberChange, addPerson }) => {
  return (
    <div>       
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Numbers = ({ namesToShow, deletePerson }) => {
  return(
    <div>
      <h2>Numbers</h2>
      {namesToShow.map(person => 
        <p key={person.id}> {person.name} {person.number} &emsp;
        <button onClick={() => deletePerson(person.id)}>delete</button></p>
      )}
    </div>
  )
}

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if(success){
    return (
      <div style={successStyle}>
        {message}
      </div>
    )    
  } else {
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const personsHook = () => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(personsHook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const sameName = persons.find(person => person.name === newName)
    console.log(sameName)

    if(sameName !== undefined) {
      if(window.confirm(`${newName} is already added to phonebook, 
        replace the old number with a new one?`)) {
        const id = sameName.id
        const changedPerson = {...sameName, number: newNumber}

        personsService
          .update(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
            successNotification(`Replaced ${changedPerson.name}'s number`)
          })
          .catch(error => {
            errorNotification(`Information of ${changedPerson.name} 
              has already been removed from the server`)
          })
      }
      setNewName('')
      setNewNumber('')
    } 
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
  
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          successNotification(`Added ${personObject.name}`)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const changedPersons = persons.filter(p => p !== person)

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deleteObject(id)
        .then(() => {
          setPersons(changedPersons)
          successNotification(`Deleted ${person.name}`)
        })
        .catch(error => {
          errorNotification(`Information of ${person.name} 
            has already been removed from the server`)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }

  const successNotification = updatedMessage => {
    setSuccessMessage(updatedMessage)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }
  const errorNotification = updatedMessage => {
    setErrorMessage(updatedMessage)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const namesToShow = (searchName === '')
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} success={true} />
      <Notification message={errorMessage} success={false} />
      <Search searchName={searchName} handleSearchChange={handleSearchChange} />
      <NewPerson 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <Numbers namesToShow={namesToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App