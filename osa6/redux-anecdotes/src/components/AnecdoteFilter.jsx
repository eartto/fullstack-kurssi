import { setFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const AnecdoteFilter = () => {
    const dispatch = useDispatch()

    const handleFilterChange = (event) => {
        event.preventDefault()
        const filterValue = event.target.value
        dispatch(setFilter(filterValue))
    }

    const style = {
        marginBottom: 10
      }

      return (
        <div style={style}>
          filter <input onChange={handleFilterChange} />
        </div>
      )
}

export default AnecdoteFilter