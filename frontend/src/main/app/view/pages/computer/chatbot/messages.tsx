import { PersonSharp, ScheduleSharp, SmartToySharp } from "@mui/icons-material";
import { Avatar, Chip, Tooltip, Typography } from "@mui/material";

import '../../../../../res/css/Chatbot.css';
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";

interface ChatbotMessageProps {
    message: string;
    agent: "USER" | "AGENT";
    timestamp: number;
}

export default function ChatbotMessage (props: ChatbotMessageProps) {
    let avatar, message, operationStatus, messageBoxClass;

    if (props.agent == "USER") {
        message = props.message
        avatar = <PersonSharp />
        messageBoxClass = "user"
    } else {
        try {
            const response = JSON.parse(props.message);
            message = response[Object.keys(response)[1]]
            operationStatus = response[Object.keys(response)[0]] as string
            if (operationStatus !== "SUCCESS") {
                messageBoxClass = "botError"
            } else {
                messageBoxClass = "botSuccess"
            }
            avatar = <SmartToySharp />
        } catch (e) {
            console.error(props.message)
        }
    }
    return (
        <div className={`${props.agent.toLowerCase()}Message`}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Chip className={`messageBox ${messageBoxClass}`} sx={{
                    minHeight: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}
                    label={message}
                />
                <Avatar>
                    {avatar}
                </Avatar>
            </div>
            <div style={{
                margin: "-12px auto 0px 16px",
                width: "100%",
                display: "flex",
                flexDirection: "row"
            }}
            >
            <Tooltip title="Envoyé au serveur">
                <Icon path={mdiCheck} color="green" size={5/6} style={{
                    marginTop: "4px"
                }}/>
            </Tooltip>
            <Typography variant="overline">
                {new Date(props.timestamp).toTimeString().slice(0, 5)}
            </Typography>
            </div>
        </div>
    )
}