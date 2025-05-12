import { Box, Divider } from "@mui/material";
import { PackedMessagesByInterval } from "../../../../controller/chatbot/chatbotSlice";
import ChatbotMessage from "./message";

interface MessagesProps {
    messages: PackedMessagesByInterval;
}

export default function Messages (props: MessagesProps) {
    return (
        <Box>
            <Divider>{props.messages.label}</Divider>
            {
                props.messages.messages.map((message) => {
                    return <ChatbotMessage
                        agent={message.agent}
                        message={message.message}
                        timestamp={message.timestamp.getTime()}
                    />
                })
            }
        </Box>
    )
}