import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import InventoryManager from './InventoryManager';
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => (
  <Router>
    <Route path='/:companyID?' component={InventoryManager} />
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'));
