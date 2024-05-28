import { useState, useEffect } from 'react'

import personService from './services/persons'

const SearchNumber = (props) => {
  return (
    <div>
      search: <input value={props.newSearch}
        onChange={props.handleSearchChange} />
    </div>
  )
}

const AddNewNumber = (props) => {
  return (
    <div>
      <form onSubmit={props.addNumber}>
        <div>
          name: <input value={props.newName}
            onChange={props.handleNameChange} />
        </div>
        <div>
          number: <input value={props.newNumber}
            onChange={props.handleNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const AddedNumbers = (props) => {
  return (
    <div>
      <ul>
        {props.persons.map(person =>
          <li key={person.name}>
            {person.name} {person.number} <button type="button" onClick={() => { props.deleteNumber(person.id) }}>delete</button>
          </li>)}
      </ul>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notif">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newSearch, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showSearched] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addNumber = (event) => {
    event.preventDefault()
    const numberObject = {
      name: newName,
      number: newNumber,
    }
    if (!persons.some(number => number.name === numberObject.name)) {
      setPersons(persons.concat(numberObject))
      setNewName('')
      console.log(numberObject)

      personService
        .create(numberObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(
            `Added ${numberObject.name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNewNumber('')
          setPersons(persons.filter(name =>
            numberObject.name !== name))
          setErrorMessage(
            error.response.data.error
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

    }

    else {
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      const numberid = persons.find(number => number.name === newName).id

      console.log(numberid)

      personService
        .update(numberid, numberObject)
        .then(response => {
          setPersons(persons.map(number => number.id !== numberid ? number :
            response.data))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const deleteNumber = (id) => {

    const name = persons.find(number => number.id === id).name

    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(number =>
            number.id !== id))
        })
    }
  }


  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }


  const numbersToShow = showSearched ? persons : persons.filter(number =>
    number.name.toLowerCase().includes(newSearch.toLowerCase()))



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <SearchNumber newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h3>add a new number</h3>
      <AddNewNumber addNumber={addNumber} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <AddedNumbers persons={numbersToShow} deleteNumber={deleteNumber} />
    </div>
  )

}

export default App
