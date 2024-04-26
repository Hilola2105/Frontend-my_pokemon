import React, {Component} from "react";
import { HashRouter as Router, Route, Routes} from "react-router-dom"; 
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Pokemon from "./Pokemon"
import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/pokemon/:pokemonIndex"  element={<Pokemon />} />
            </Routes>
            </div>
        </div>
      </Router>
      
    );
  }
}

export default App;
