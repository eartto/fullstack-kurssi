import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)


const StatisticsLine = ({value, text}) => (
  <div>
    {text}
    {' '}
    {value}
  </div>
)

const Statistics = (props) => {

  if (props.total.length === 0) {
    return (
      <div>
        <p>
          No feedback given
        </p>
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{props.good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{props.neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{props.bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{props.good + props.neutral + props.bad}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{(props.good - props.bad) / (props.good + props.neutral + props.bad)}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{props.good / (props.good + props.neutral + props.bad) + ' %'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  const feedbackTitle = 'give feedback'
  const statisticsTitle = 'statistics'
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState([])

  const handleGoodClick = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  return (
    <div>
      <p>{feedbackTitle}</p>
      <Button handleClick={handleGoodClick} text = 'good'/>
      <Button handleClick={handleNeutralClick} text = 'neutral'/>
      <Button handleClick={handleBadClick} text = 'bad'/>
      <p>{statisticsTitle}</p>
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {total}/>
    </div>
  )
}

export default App
