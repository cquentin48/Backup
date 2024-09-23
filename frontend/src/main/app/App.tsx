import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "../res/gfx/logo.svg";
import "../res/css/App.css";
import ComputerPage from "./pages/computer/computerPage";
import Computer from "./model/computer";

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
                    <Route path="/computer"
                        element={<ComputerPage computer={
                            new Computer("quentin-dev-pc",
                                "11th Gen Intel(R) Core(TM) i5-11400H @ 2.70GHz",
                                12,
                                16535711744,
                                "Ubuntu 22.04.4")}
                        />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
