import React, { useState } from "react";

import { PsychologySharp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import ChatBotDialog from "./dialog";

import '../../../../../res/css/Chatbot.css'

export default function ChatBotButton (): React.JSX.Element {
    const [isOpened, open] = useState(false);

    const handleClose = () => {
        open(false)
    }

    return (<div id="chatbotButton">
        <Tooltip title={"Launch the chatbot"}>
            <IconButton
                onClick={() => open(true)}
                sx={{

                }}
            >
                <PsychologySharp />
            </IconButton>
        </Tooltip>
        <ChatBotDialog
            isOpened={isOpened}
            handleClose={handleClose}
        />
    </div>)
}