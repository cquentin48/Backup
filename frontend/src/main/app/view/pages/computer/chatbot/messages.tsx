import { PersonSharp, SmartToySharp } from "@mui/icons-material";
import { Avatar, Paper } from "@mui/material";

import '../../../../../res/css/Chatbot.css';

interface ChatbotMessageProps {
    message: string;
    agent: "USER" | "AGENT";
}

export default function ChatbotMessage (props: ChatbotMessageProps) {
    let avatar;
    if (props.agent == "USER") {
        avatar = <PersonSharp/>
    } else {
        avatar = <SmartToySharp/>
    }
    return (
        <div className={`${props.agent.toLowerCase()}Message`}>
            <Paper className="messageBox">
                {props.message}
                <br/>
            </Paper>
            <Avatar>
                {avatar}
            </Avatar>
        </div>
    )
}