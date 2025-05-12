import { useSelector } from "react-redux";
import { SendSharp } from "@mui/icons-material";
import { Box, TextField, InputAdornment, Divider } from "@mui/material";

import { chatbotSliceState, FormattedDates as PackedMessages, MessageDialog } from "../../../../controller/chatbot/chatbotSlice";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import ChatbotMessage from "./message";
import NewChatbotConversationText from "./newConversationText";
import Messages from "./messages";

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
    let [packedMessages, setPackedMessages] = useState<PackedMessages>({
        before: {label: "Avant", messages: []},
        lastMonth: {label: "Mois dernier", messages: []},
        lastWeek: {label: "Semaine dernière", messages: []},
        lastYear: {label: "Année dernière", messages: []},
        today: {label: "Aujourd'hui", messages: []}
    });

    /**
     * Based off the loaded messages from the server, pack them into lists
     * @param {Array<MessageDialog>} messages Loaded messages from the server
     * @returns {PackedMessages} Messages packed into lists
     */
    const packMessages = (messages: Array<MessageDialog>): PackedMessages => {
        const currentDate = new Date(Date.now())
        let formatDates: PackedMessages = {
            today: {
                label: "Aujourd'hui",
                messages: []
            },
            lastWeek: {
                label: "Semaine dernière",
                messages: []
            },
            lastMonth: {
                label: "Mois dernier",
                messages: []
            },
            lastYear: {
                label: "Année dernière",
                messages: []
            },
            before: {
                label: "Avant",
                messages: []
            }
        };

        messages.forEach(message => {
            const messageDate = message.timestamp
            if (messageDate.toLocaleDateString() === currentDate.toLocaleDateString()) {
                formatDates.today.messages.push(message)
            }
            else if ((messageDate.getTime() - currentDate.getTime()) / (3600 * 1000 * 24) <= 7) {
                formatDates.lastWeek.messages.push(message)
            }
            else if ((messageDate.getMonth() + 1) % 12 === currentDate.getMonth()) {
                formatDates.lastMonth.messages.push(message)
            } else if (messageDate.getFullYear() - 1 === currentDate.getFullYear()) {
                formatDates.lastYear.messages.push(message)
            } else {
                formatDates.before.messages.push(message)
            }
        })
        return formatDates;
    }

    useEffect(() => {
        setPackedMessages(packMessages(messages));
    }, [messages])

    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
                width="100%"
            >
                <Box sx={{
                    marginLeft: "auto",
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                    width: "100%"
                }}>
                    {
                        messages.length == 0 && <NewChatbotConversationText/>
                    }
                    {
                        packedMessages.before.messages.length > 0 &&
                        <Messages messages={packedMessages.before}/>
                    }
                    {
                        packedMessages.lastYear.messages.length > 0 &&
                        <Messages messages={packedMessages.lastYear}/>
                    }
                    {
                        packedMessages.lastMonth.messages.length > 0 &&
                        <Messages messages={packedMessages.lastMonth}/>
                    }
                    {
                        packedMessages.lastWeek.messages.length > 0 &&
                        <Messages messages={packedMessages.lastWeek}/>
                    }
                    {
                        packedMessages.today.messages.length > 0 &&
                        <Messages messages={packedMessages.today}/>
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
                <Box>
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
                                )
                            },
                        }}
                        sx={{
                            m: "16px 0px",
                            bottom: "6px",
                            position: "absolute"
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}