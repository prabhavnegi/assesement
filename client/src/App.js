import React, { useContext} from 'react';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import  {userContext} from './UserProvider'
import {Main} from './components/Main';
import {Login} from './components/Login';
import {SignUp} from './components/Singup';
function App() {
  const {logState,loading} = useContext(userContext)
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path = '/signUp' render={ () => { return loading?"":logState ? <Redirect to='/'/> : <SignUp/> }}/>
          <Route path = '/' render={ () => { return loading?"":logState ? <Main/> : <Login/> }}/>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
