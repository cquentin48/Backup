import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import gqlClient from "./model/queries/client";

import "../res/css/App.css";
import ComputerPage from "./view/pages/computer/computerPage";
import TopBar from "./view/pages/computer/topbar";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./controller/store";

/**
 * Web application main function
 * @returns { React.JSX.Element } Application main component in the HTML page
 */
function App (): React.JSX.Element {
    return (
        <div className="App">
            <Provider store={store}>
                <ApolloProvider client={gqlClient.get_query_client()}>
                    <SnackbarProvider
                        maxSnack={4}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                    >
                        <TopBar />
                        <BrowserRouter
                            future={{
                                v7_startTransition: true,
                                v7_relativeSplatPath: true
                            }}
                        >
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
                                    element={<ComputerPage />} />
                            </Routes>
                        </BrowserRouter>
                    </SnackbarProvider>
                </ApolloProvider>
            </Provider>
        </div>
    );
}

export default App;
