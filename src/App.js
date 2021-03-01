import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainPage from './Main/MainPage.js';
import InfoPage from './Instructions/InstructionPage.js';

class App extends Component {
  render(){
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/information' component={InfoPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;