import { useSelector } from "react-redux";
import { AccountCircle, SendSharp, SmartToy } from "@mui/icons-material";
import { Box, TextField, InputAdornment } from "@mui/material";

import { chatbotSliceState } from "../../../../controller/deviceMainInfos/chatbotSlice";
import { useState } from "react";
import { useSnackbar } from "notistack";
import ChatbotMessage from "./messages";
import NewChatbotConversationText from "./newConversationText";

/**
 * Send message method passed from the dialog
 */
interface ChatbotConversationProps{
    sendMessage: (message:string) => void; 
}

/**
 * 
 * @param props 
 * @returns 
 */
export default function ChatbotConversation (props: ChatbotConversationProps) {
    const { messages } = useSelector(chatbotSliceState)
    const [newMessage, updateWrittenMessage] = useState("")
        const [firstUpdate, setFirstUpdate] = useState(true)
    const {enqueueSnackbar} = useSnackbar();

    return (
        <div>
            {
                messages.map((message) => {
                    return <ChatbotMessage
                        agent={message.agent}
                        message={message.text}
                    />
                })
            }
            {
                messages.length == 0 && <NewChatbotConversationText/>
            }
            <Box
                id="userInput"
                alignItems="center"
                gap={1}
                sx={{
                    flex: "1 1 0%"
                }}
            >
                <TextField
                    id="chatbot-input"
                    label="Question posée"
                    variant="standard"
                    defaultValue="Écrivez votre demande ici..."
                    value={newMessage}
                    autoFocus
                    multiline
                    helperText={
                        (newMessage == "" && !firstUpdate) ?
                            "Vous ne pouvez pas envoyer un message vide!" :
                            ""
                    }
                    error={newMessage != "" && !firstUpdate}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            if (newMessage == "" && !firstUpdate) {
                                enqueueSnackbar(
                                    "Vous ne pouvez pas envoyer de message vide!",
                                    {
                                        variant: "error"
                                    }
                                )
                            }
                            props.sendMessage(newMessage)
                            e.preventDefault()
                        }
                    }}
                    onChange={(e) => {
                        if (e.target.value !== "" && firstUpdate) {
                            setFirstUpdate(false)
                        }
                        updateWrittenMessage(e.target.value)
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SendSharp />
                                </InputAdornment>
                            ),
                        }
                    }}
                    sx={{
                        margin: "16px",
                        bottom: "16px",
                        position: "absolute",
                        width: "calc(100% - 32px)"
                    }}
                />
            </Box>
        </div>
    )
}