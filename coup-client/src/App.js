import React from 'react';
import CreateGame from './components/CreateGame';
import './App.css';
import ReactGA from 'react-ga';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import JoinGame from './components/JoinGame';
import Home from './components/Home';
import Language from './components/Language';

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
      <p className="languageContainer"><Language /></p>
    </div>
  );
}

export default App;
