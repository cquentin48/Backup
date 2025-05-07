import { PersonSharp, SmartToySharp } from "@mui/icons-material";
import { Avatar, Paper, Typography } from "@mui/material";

import '../../../../../res/css/Chatbot.css';

interface ChatbotMessageProps {
    message: string;
    agent: "USER" | "AGENT";
}

export default function ChatbotMessage (props: ChatbotMessageProps) {
    let avatar, message, operationStatus, messageBoxClass;

    if (props.agent == "USER") {
        message = props.message
        avatar = <PersonSharp />
        messageBoxClass = "user"
    } else {
        const response = JSON.parse(props.message);
        message = response[Object.keys(response)[1]]
        operationStatus = response[Object.keys(response)[0]] as string
        if (operationStatus !== "SUCCESS") {
            messageBoxClass = "botError"
        } else {
            messageBoxClass = "botSuccess"
        }

        avatar = <SmartToySharp />
    }
    return (
        <div className={`${props.agent.toLowerCase()}Message`}>
            <Paper className={`messageBox ${messageBoxClass}`} sx={{
                minHeight: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                {message}
                <br />
                <Typography variant="overline">
                    Écrit le {new Date(Date.now()).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </Typography>
            </Paper>
            <Avatar>
                {avatar}
            </Avatar>
        </div>
    )
}