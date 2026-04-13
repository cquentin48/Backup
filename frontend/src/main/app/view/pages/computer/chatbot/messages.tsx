import React from "react";

import { Box, Divider } from "@mui/material";
import { type PackedMessagesByInterval } from "../../../../controller/chatbot/chatbotSlice";
import ChatbotMessage from "./message";

interface MessagesProps {
    messages: PackedMessagesByInterval
}

/**
 * Messages written either by a user or by the AI companion in a conversation box
 * @param {MessagesProps} props Every written message data
 * @returns {React.JSX.Element} Rendered list as DOM element
 */
export default function Messages (props: MessagesProps): React.JSX.Element {
    return (
        <Box>
            <Divider>{props.messages.label}</Divider>
            {
                props.messages.messages.map((message, index) => {
                    return <ChatbotMessage
                        key={index}
                        agent={message.agent}
                        message={message.message}
                        timestamp={message.timestamp.getTime()}
                    />
                })
            }
        </Box>
    )
}
