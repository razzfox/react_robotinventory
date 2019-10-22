import React, { Component } from 'react'
import './Dashboard.css'

class Dashboard extends Component {
  // Note: Although I could have written the 
  localDateTime = date => {
    // set date to current time
    // date-only strings (e.g. "1970-01-01") are treated as UTC, not local time
    let localTime = new Date(date)

    // simple check for ISO 8601 date
    if (! date.includes('T')) {
      let now = new Date()
      // parse date
      let [ year, month, day ] = date.split('-')
      localTime.setFullYear(year, month -1, day, now.getHours(), now.getMinutes())
    }

    // format string
    let options = { year: 'numeric', month: 'short', day: 'numeric' }
    localTime = localTime.toLocaleDateString('en-us', options)
    return localTime.replace(',', '')
  }

  EventCards = props =>
    <ul>{this.props.eventList.map(({ name, id, date, type }) =>
      <li key={id} className='eventCard'>
        <header>
          <h4>{type}</h4>
          <h4>{this.localDateTime(date)}</h4>
        </header>
        {name}
      </li>
    )}</ul>

  render() {
    return (
      <div className="Dashboard">
        <header>
          <h2>Dashboard</h2>
        </header>

        <h3>Recent Updates</h3>
        <this.EventCards />
      </div>
    )
  }
}

export default Dashboard
