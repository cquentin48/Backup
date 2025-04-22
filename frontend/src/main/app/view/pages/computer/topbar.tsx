import React from "react"

import "../../../../res/css/Topbar.css";
import { AppBar, Box, Toolbar } from "@mui/material";
import ChatBotButton from "./chatbot/button";

export default class TopBar extends React.Component {
    render (): React.ReactNode {
        return (
            <Box id="TopBar" sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }} />
                        <ChatBotButton />
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}
