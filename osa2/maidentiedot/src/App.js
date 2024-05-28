import { useState, useEffect } from 'react'

import countryService from './services/countries'

const FindCountries = (props) => {
  return (
    <div>
      find countries <input value={props.newSearch}
      onChange={props.handleSearchChange}/>
    </div>
  )
}

const CountryList = (props) => {
  if (props.showSearched === false) {
    return null
  }
  return (
    <div>
      <ul>
        {props.countries.map(country =>
        <li key={country.name.common}>
          {country.name.common} <button onClick={() => props.handleShowClick(country.name.common)}>show</button>
        </li>)}
      </ul>
    </div>
  )
}

const CountryDisplay = (props) => {
  if (props.showCountry === false) {
    return null
  }
  return (
    <div>
        <h1>{props.countries[0].name.common}</h1>
          <div>
          capital: {props.countries[0].capital}
          </div>
            <div>
            area: {props.countries[0].area}
            </div>
            <h3>Languages:</h3>
            <ul>
            {Object.keys(props.countries[0].languages).map((keyName, i) => (
            <li key={i}>
                {props.countries[0].languages[keyName]}
            </li>
              ))}
            </ul>
            <div>
            <img src={props.countries[0].flags.png} alt="flag"/>
            </div>
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

const App = () => {
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [newSearch, setSearch] = useState('')
  const [showSearched, setShowShearched] = useState(true)
  const [showCountry, setShowCountry] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)


  useEffect(() => {
    countryService
    .getAll()
    .then(response => {
      setCountries(response.data)
      })
  }, [])


  const handleSearchChange = (event) => {
    setSearch(event.target.value)

    const tempCountriesToShow = countries.filter(country =>
      country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))

    setCountriesToShow(tempCountriesToShow)
    if (event.target.value.trim().length === 0) {
      setNotificationMessage(null)
      setShowShearched(false)
      setShowCountry(false)
    }
    else if (tempCountriesToShow.length === 1) {
      setNotificationMessage(null)
      setShowShearched(false)
      setShowCountry(true)
      console.log(tempCountriesToShow[0].name.common)
    }
    else if (tempCountriesToShow.length <= 10) {
      setNotificationMessage(null)
      setShowShearched(true)
      setShowCountry(false)
    }
    else {
      setNotificationMessage('list too long')
      setShowShearched(false)
      setShowCountry(false)
    }
  }

  const handleShowClick = (name) => {
    const showCountry = countriesToShow.find(country => country.name.common === name)
    console.log(showCountry.name.common)
    setCountriesToShow(countriesToShow.filter(country =>
      country.name.common === showCountry.name.common))
    setShowShearched(false)
    setShowCountry(true)

  }


  return (
    <div>
      <FindCountries newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <Notification message={notificationMessage}/>
      <CountryList showSearched={showSearched} countries={countriesToShow} handleShowClick={handleShowClick}/>
      <CountryDisplay showCountry={showCountry} countries={countriesToShow}/>
    </div>
  )

}

export default App;
