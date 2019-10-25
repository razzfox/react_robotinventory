import React, { Component } from 'react'
import './AddRobot.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class AddRobot extends Component {
  constructor(props) {
    super(props)

    this.locationList = ['San Francisco', 'Tokyo', 'France', 'Shanghai']

    this.state = {
      name: '',
      location: this.locationList[0],
      id: ''
    }
  }

  closeAddRobotTray = event => {
    // Toggle Add Robot Tray. Use CSS to animate it.
    this.props.toggleAddRobotTray()

    // clear child fields
    this.setState({
      name: '',
      location: this.locationList[0],
      id: ''
    })
  }

  addRobot = event => {
    // do not reload page when using form onSubmit
    event.preventDefault()
    let robot = {
      name: this.state.name,
      location: this.state.location,
      id: this.state.id
    }
    // Add Robot
    this.props.addRobot(robot)

    // Close Tray
    this.closeAddRobotTray()
  }

  // a generalized helper function that updates state variables in a standard way,
  // in order to reduce redundant code that only updates a single state variable.
  // Use this when the input's name or id matches the state variable name.
  inputStateUpdate = event => this.setState({[event.target.name || event.target.id]: event.target.value})

  render() {
    return (
      <form
        // Taking advantage of form onSubmit autodetecting the enter key.
        // This helps out people on mobile since mobile keyboards include a submit button,
        // which is faster than closing the keyboard, and tapping the submit button, which
        // is usually off screen when inputs are focused.
        // Caveats: The onSubmit needs to call event.preventDefault() and all other buttons
        // need type="button" attribute so that only one is type="submit" (default).
        // That's one good reason to leave buttons to sumbit forms, and use div onClick otherwise.
        onSubmit={this.addRobot} className="AddRobot">
        <header>
          <h2>Add New Robot</h2>
          <div className='closeButton'><FontAwesomeIcon size='2x' icon={faTimes} className='closeIcon'
            onClick={this.closeAddRobotTray} /></div>
        </header>

        <section>
          <label>
            Robot Name
            <input
              name='name'
              placeholder='i.e. RoboCop'
              value={this.state.name}
              onChange={this.inputStateUpdate} />
          </label>
          <label>
            Location
            <select
              name='location'
              placeholder='i.e. San Francisco'
              value={this.state.location}
              onChange={this.inputStateUpdate}>{
                this.locationList.map(name =>
                  <option
                    key={name}
                    value={name}
                  >{name}</option>
                )}</select>
          </label>
          <label>
            Robot ID
            <input
              name='id'
              placeholder='i.e. abc-123 (optional)'
              value={this.state.id}
              onChange={this.inputStateUpdate} />
          </label>
        </section>

        <section>
          <button
            type="button"
            onClick={this.closeAddRobotTray}
            className='cancel'>Cancel</button>
          <button
            type="submit"
            >Add Robot</button>
        </section>
      </form>
    )
  }
}

export default AddRobot
