import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "../res/gfx/logo.svg";
import "../res/css/App.css";

function App (): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" id="appLogo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<p>Bonjour!</p>} />
          <Route path="/test" element={<p>Element de test!</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
