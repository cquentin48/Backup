import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import gqlClient from "./model/queries/client";
import "../res/css/App.css";
import ComputerPage from "./pages/computer/computerPage";
import TopBar from "./widget/topbar";

function App (): JSX.Element {
    return (
        <div className="App">
            <ApolloProvider client={gqlClient.get_query_client()}>
                <TopBar />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<p>Bonjour!</p>} />
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
