import React from 'react';
import {db, auth} from "../config/fbConfig";
import Menu from "./Menu";
import '../style/App.scss';

function App() {
  return (
    <div className="App">
      <Menu />
      <div>
        yo
      </div>
    </div>
  );
}

export default App;
