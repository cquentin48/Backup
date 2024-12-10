import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../res/css/App.css";
import ComputerPage from "./pages/computer/computerPage";
import Computer from "./model/computer";
import TopBar from "./widget/topbar";

function App (): JSX.Element {
    return (
        <div className="App">
            <TopBar/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<p>Bonjour!</p>} />
                    <Route path="/test" element={<p>Element de test!</p>} />
                    <Route path="/computer/:id"
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
