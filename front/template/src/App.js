import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import {Core} from './Relast/core.js';
import Comp1 from './comps/Comp1.jsx';
import Comp2 from './comps/Comp2.jsx';

function App() {
  Core.create_mods(['App', 'Comp1', 'Comp2']);

  const [_flag, set_flag] = useState(1);

  Core.add_state('App', '_flag', set_flag, _flag);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {Core._mods.App.states._flag}
        <Comp1 />
        <Comp2 />
      </header>
    </div>
  );
}

export default App;
