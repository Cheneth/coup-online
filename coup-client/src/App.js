import React from 'react';
import logo from './logo.svg';
import CreateGame from './components/CreateGame';
import './App.css';
import ReactGA from 'react-ga';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import JoinGame from './components/JoinGame';
import Home from './components/Home';

const trackingId = process.env.REACT_APP_GOOGLE_TRACKING_ID || '';
ReactGA.initialize(trackingId);
ReactGA.pageview('/homepage');

function App() {

  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/create">
              <CreateGame></CreateGame>
            </Route>
            <Route path="/join">
              <JoinGame></JoinGame>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </div>
      </Router>
      
    </div>
  );
}

export default App;
