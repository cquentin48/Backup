import { PersonSharp, SmartToySharp } from "@mui/icons-material";
import { Paper } from "@mui/material";

interface ChatbotMessageProps {
    message: string;
    agent: "USER" | "AGENT";
}

export default function ChatbotMessage (props: ChatbotMessageProps) {
    if(props.agent == "USER"){
        return (
            <div className="message">
                <Paper className={`message${props.agent}`}>
                    {props.message}
                </Paper>
                <PersonSharp/>
            </div>
        )
    }else{
        return (
            <div className="message">
                <SmartToySharp/>
                <Paper className={`message${props.agent}`}>
                    {props.message}
                </Paper>
            </div>
        )
    }
}