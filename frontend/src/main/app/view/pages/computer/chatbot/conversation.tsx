import { useSelector } from "react-redux";
import { SendSharp } from "@mui/icons-material";
import { Box, TextField, InputAdornment, Divider } from "@mui/material";

import { chatbotSliceState } from "../../../../controller/deviceMainInfos/chatbotSlice";
import { useState } from "react";
import { useSnackbar } from "notistack";
import ChatbotMessage from "./messages";
import NewChatbotConversationText from "./newConversationText";

/**
 * Send message method passed from the dialog
 */
interface ChatbotConversationProps {
    sendMessage: (message: string) => void;
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
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
            >
                <Box sx={{
                        marginLeft: "auto",
                        display: "flex",
                        flexDirection: "column",
                        flex: "1"
                        }}>
                    {
                        messages.map((message) => {
                            return <ChatbotMessage
                                agent={message.agent}
                                message={message.message}
                                timestamp={message.timestamp}
                            />
                        })
                    }
                    {
                        messages.length == 0 && <NewChatbotConversationText />
                    }
                </Box>
            </Box>
            <Box
                id="userInput"
                alignItems="center"
                gap={1}
                sx={{
                    mb: "0",
                    height: "100",
                }}
            >
            <Divider/>
                <TextField
                    id="chatbot-input"
                    variant="standard"
                    placeholder="Écrivez votre demande ici..."
                    value={newMessage}
                    autoFocus
                    multiline
                    helperText={
                        (newMessage == "" && !firstUpdate) ?
                            "Vous ne pouvez pas envoyer un message vide!" :
                            ""
                    }
                    error={newMessage == "" && !firstUpdate}
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
                            updateWrittenMessage("")
                            setFirstUpdate(true)
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
                        position: "absolute"
                    }}
                />
            </Box>
        </Box>
    )
}