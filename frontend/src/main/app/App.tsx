import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import gqlClient from "./model/queries/client";

import "../res/css/App.css";
import ComputerPage from "./view/pages/computer/computerPage";
import TopBar from "./view/widget/topbar";

/**
 * Web application main function
 * @returns { React.JSX.Element } Application main component in the HTML page
 */
function App (): React.JSX.Element {
    return (
        <div className="App">
            <ApolloProvider client={gqlClient.get_query_client()}>
                <TopBar />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={
                            <div>
                                <p>Bonjour!</p>
                                <p><Link
                                    to={{
                                        pathname: "/test"
                                    }}
                                /></p>
                            </div>
                        } />
                        <Route path="/test" element={<p>Element de test!</p>} />
                        <Route path="/computer/:id"
                            element={<ComputerPage graphqlQueryOperationManager={gqlClient} />} />
                    </Routes>
                </BrowserRouter>
            </ApolloProvider>
        </div>
    );
}

export default App;
