import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import './Robots.css'
import AddRobot from './AddRobot.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactModal from 'react-modal';

// For Assistive Devices
ReactModal.setAppElement('#app')

class Robots extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deleteRobot: {},
      showModal: false
    }
  }

  // Set table order, optional title, optional colspan (how many columns to span)
  headers = [{key:'name'}, {key:'location'}, {key:'id', name:'Robot ID', colspan:'2'}]

  TableHeader = () =>
    <tr key='0'>{
      this.headers.map(({ key, name, colspan }) =>
        <th key={key} colSpan={colspan}>{(name || key).toUpperCase()}</th>
    )}</tr>

  TableData = () => this.props.robotList.map(robot =>
    <tr key={robot.id}>{
      this.headers.map(({ key }) =>
        <td key={robot.id + key}>{robot[key]}</td>
      )}<td key={robot.id + '_delete'}><button
        type="button"
        onClick={event =>
          this.setState({
            deleteRobot: robot,
            showModal: true
          })
        } ><FontAwesomeIcon icon={faTrashAlt} /></button></td>
    </tr>
  )

  deleteRobot = event => {
    // close modal
    this.toggleDeleteRobotModal()

    // call parent's function
    this.props.deleteRobot(this.state.deleteRobot)
  }

  toggleDeleteRobotModal = event => this.setState(state => ({ showModal: !state.showModal }))

  toggleAddRobotTray = event => {
    // use ref
    let addRobotTray = ReactDOM.findDOMNode(this.refs.AddRobotTray)
    // alternative to document query selector
    // document.querySelector('.AddRobot').classList.toggle('show')

    // Show Add Robot Tray. Use CSS to animate it.
    addRobotTray.classList.toggle('show')

    // focus first input if tray is shown
    if (addRobotTray.classList.contains('show')) {
      addRobotTray.querySelector('input').focus()
    } else {
      addRobotTray.querySelector('input').blur()
    }
  }

  render() {
    return (
      <div className="Robots">
        <header>
          <h2>Robots</h2>
          <button
            type="button" 
            onClick={this.toggleAddRobotTray}>Add New Robot</button>
        </header>

        <table id='robotTable'>
            <tbody>
              <this.TableHeader />
              <this.TableData />
            </tbody>
        </table>

        <AddRobot
          ref='AddRobotTray'
          toggleAddRobotTray={this.toggleAddRobotTray}
          addRobot={this.props.addRobot} />

        <ReactModal 
          isOpen={this.state.showModal}
          onRequestClose={this.toggleDeleteRobotModal}
          closeTimeoutMS={500}
          // cancel default inline styles
          style={{
              overlay: {
                backgroundColor: null
              },
              content: {
                border: null,
                borderRadius: null
              }
            }}
          contentLabel="Confirm Delete" >
          <header>
            <h3>Remove {this.state.deleteRobot.name}?</h3>
            <div className='closeButton'><FontAwesomeIcon size='lg' icon={faTimes} className='closeIcon'
              onClick={this.toggleDeleteRobotModal} /></div>
          </header>
          This will remove {this.state.deleteRobot.name} from its job.
          <button type="button" onClick={this.deleteRobot}>Confirm</button>
        </ReactModal>
      </div>
    )
  }
}

export default Robots
