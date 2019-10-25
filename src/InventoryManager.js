import React, { Component } from 'react'
import {
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faRobot } from '@fortawesome/free-solid-svg-icons'
import './InventoryManager.css'
import Dashboard from './Dashboard.js'
import Robots from './Robots.js'

class InventoryManager extends Component {
  constructor(props) {
    super(props)

    // paths
    this.dashboardPath = '/'
    this.dashboardRoute = `${this.dashboardPath}:companyID?`
    this.robotsPath = '/robots'
    this.robotsRoute = `${this.dashboardRoute}${this.robotsPath}`

    // state
    // normalized data: entities reference each other by id, as in a relational database
    // Note: location may also be made into a normalized ID
    this.state = {
      companyList: [],
      eventList: [],
      robotList: [],
    }
    // Note: the selected companyID is a property of the current route. it is not in the local state

    this.fetchStateFromServer()
    
    // Check current route for a valid companyID before mounting the component
    // this.validateCompanyID(this.props.match.params.companyID)
  }

  componentDidMount () {
    // Create a select option value to be displayed on initial load.
    // Placeholder is the first selected disabled option.
    // React complains about using 'selected' manually, and does not allow
    // defaultValue on controlled components, so I have to add this manually.

    let option = document.createElement('option')
    option.setAttribute('selected', true)
    option.setAttribute('disabled', true)
    option.setAttribute('value', null)
    option.innerHTML = 'Company'

    document.getElementById('selectedCompanyID').appendChild(option)
    // console.log('option', option)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Validate new route
    // if (this.props.match.params.companyID !== prevProps.match.params.companyID) {
    //   this.validateCompanyID(this.props.match.params.companyID)
    // }

    // Note: must specify https
    // let dataLocation = 'https://localhost/data', method = 'PUT'
    let dataLocation = `https://${window.location.hostname}/data`, method = 'PUT'
    let headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })

    // console.log('state', this.state)

    fetch(
      new Request(dataLocation, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(this.state)
      })
    ).then(r=>{console.log(`received ${method} response`, r); return r.json()}).then(r=>console.log(`received ${method} state`, r)).catch(r=>console.log(r))
  }

  fetchStateFromServer = () => {
    // Note: must specify https
    // let dataLocation = 'https://localhost/data', method = 'GET'
    let dataLocation = `https://${window.location.hostname}/data`, method = 'GET'
    let headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })

    // console.log('state', this.state)

    fetch(
      new Request(dataLocation, {
        method,
        headers,
        credentials: 'include',
      })
    ).then(r=>r.json()).then(r=>{
      console.log(`received ${method} state`, r)
      let newState = JSON.parse(r[0].body)
      this.setState(newState, this.validateCompanyID)
    }).catch(r=>{
      console.log(r)
      // Fallback data
      this.setState(
        {
          companyList: [
            {name:'Company One', id:'c1'},
            {name:'Company Two', id:'c2'}
          ],
          eventList: [
            {name:'Added Robot Zero', id:'e0', companyID:'c1', date:'2019-10-07', type:'Robots'},
            {name:'Added Robot One', id:'e1', companyID:'c1', date:'2019-10-08', type:'Robots'},
            {name:'Removed Robot Zero', id:'e2', companyID:'c1', date:'2019-10-10', type:'Robots'},
            {name:'Added Robot Two', id:'e3', companyID:'c2', date:'2019-10-09', type:'Robots'},
            {name:'Added Robot Three', id:'e4', companyID:'c2', date:'2019-10-09', type:'Robots'},
            {name:'Added Robot Four', id:'e5', companyID:'c2', date:'2019-10-10', type:'Robots'}
          ],
          robotList: [
            {name:'Robot One', id:'r1', companyID:'c1', location:'San Francisco'},
            {name:'Robot Two', id:'r2', companyID:'c2', location:'San Francisco'},
            {name:'Robot Three', id:'r3', companyID:'c2', location:'Tokyo'},
            {name:'Robot Four', id:'r4', companyID:'c2', location:'Paris'}
          ]
        },
        this.validateCompanyID
      )
    })
  }

  validateCompanyID = companyID => {
    // allow the loaded route to set the companyID after data has been fetched
    companyID = companyID || this.props.match.params.companyID
    // if companyID is missing or invalid
    if (!companyID || ! this.state.companyList.find(c => c.id === companyID)) {
      console.log('Invalid or missing companyID, redirecting to first company', companyID)
      // get first company in list
      companyID = (this.state.companyList[0] && this.state.companyList[0].id) || ''
      // replace the matched route with a new companyID, and keep the same base path
      companyID && this.props.history.replace(`${this.dashboardPath}${companyID}`)
    }
  }

  addRobot = robot => this.setState(state => ({
    robotList: [...state.robotList, {
        name: robot.name || 'Untitled Robot',
        location: robot.location || 'San Francisco',
        id: robot.id || `r${state.robotList.length + 1}`,
        companyID: this.props.match.params.companyID,
      }
    ],
    eventList: [...state.eventList,
      {
        name: `Added ${robot.name || 'Untitled Robot'}`,
        id: `e${state.eventList.length + 1}`,
        companyID: this.props.match.params.companyID,
        date: new Date().toISOString(),
        type: 'Robots'
      }
    ]
  }))

  deleteRobot = robot => this.setState(state => ({
    robotList: state.robotList.filter(r => r.id !== robot.id),
    eventList: [...state.eventList,
      {
        name: `Removed ${robot.name}`,
        id: `e${state.eventList.length + 1}`,
        companyID: robot.companyID,
        date: new Date().toISOString(),
        type: 'Robots'
      }
    ]
  }))

  updateSelectedCompanyID = event => {
    // update the current location with a new companyID, and keeps nested routes like /robots
    let newPath = this.props.location.pathname.replace(this.props.match.url, this.dashboardPath + event.target.value)
    console.log('Updating selected company', newPath)
    this.props.history.push(newPath)
  }

  CompanyDropdown = props =>
    <select
      id='selectedCompanyID'
      value={this.props.match.params.companyID}
      onChange={this.updateSelectedCompanyID} >{
        this.state.companyList.map(({name, id}) =>
          <option
            key={id}
            value={id}
          >{name}</option>
        )}</select>

  Navigation = props =>
    <nav role="navigation">
      <section>
        <header className="InventoryManager-header">
          <h1><Link to="/" className="InventoryManager-logo"><span role="img" aria-label="robot">🤖</span> React App Demo 1</Link></h1>
        </header>
        
        <this.CompanyDropdown />
      </section>

      <section>
        <ul>
          <NavLink
            to={this.props.match.url}
            exact activeClassName="selected"><li><FontAwesomeIcon icon={faHistory} size='lg' className='fa-icon' />Dashboard</li></NavLink>
          <NavLink
            to={`${this.props.match.url}${this.robotsPath}`}
            exact activeClassName="selected"><li><FontAwesomeIcon icon={faRobot} size='lg' className='fa-icon' />Robots</li></NavLink>
        </ul>
      </section>
    </nav>

  render() {
    // Filter data by the selected companyID
    // Note: This could be done in many different ways depending on the back end API:
    // Depending on the data, we might only fetch the specific data that we need,
    // or use a data structure (i.e. map) to only access specific data.
    const selectedCompanyEventList = this.state.eventList.filter(e => e.companyID === this.props.match.params.companyID) || []
    const selectedCompanyRobotList = this.state.robotList.filter(r => r.companyID === this.props.match.params.companyID) || []
    
    return (
    <>
      <this.Navigation />

      <main>
        <Switch>
          <Route
            path={this.robotsRoute}
            render={routeProps =>
              <Robots
                {...routeProps}
                addRobot={this.addRobot}
                deleteRobot={this.deleteRobot}
                robotList={selectedCompanyRobotList} />} />
          <Route
            path={this.dashboardRoute}
            render={routeProps =>
              <Dashboard
                {...routeProps}
                eventList={selectedCompanyEventList} />} />
        </Switch>
      </main>
    </>
  )}
}

export default InventoryManager
