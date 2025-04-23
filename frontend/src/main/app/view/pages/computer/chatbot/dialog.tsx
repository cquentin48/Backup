import React, { useEffect, useState } from "react";

import { AccountCircle, PsychologyAlt, SendSharp } from "@mui/icons-material";
import {
    Box, Dialog, DialogContent, DialogTitle,
    Divider,
    InputAdornment, SelectChangeEvent, TextField,
    Typography
} from "@mui/material";
import { useSnackbar } from "notistack";


import ChatbotDialogSelect from "./select";
import { useDispatch, useSelector } from "react-redux";
import { chatbotSliceState } from "../../../../controller/deviceMainInfos/chatbotSlice";
import { addMessage, setConversationsHeaders, setMessages, addConversation } from "../../../../controller/deviceMainInfos/chatbotSlice";

import '../../../../../res/css/Chatbot.css';
import ChatbotConversation from "./conversation";

/**
 * Props passed from the chatbot toggle button
 */
interface ChatBotDialogProps {
    /**
     * If the dialog is opened or not
     */
    isOpened: boolean;

    /**
     * Handle close function
     */
    handleClose: () => void;
}

/**
 * Socket message data
 */
interface SocketData {
    /**
     * Socket message action type
     */
    actionType: string;

    /**
     * Socket message object data
     */
    [clé: string]: any;
}

/**
 * Dialog for the chatbot
 * @param {ChatBotDialogProps} props Is opened state and close dialog passed from the button
 * @returns {React.JSX.Element} rendered component
 */
export default function ChatBotDialog (props: ChatBotDialogProps): React.JSX.Element {
    const [id, setID] = React.useState(-1)
    const [isConnected, setConnectionStatus] = useState(false)
    const [socket, setSocket] = useState<WebSocket|null>(null);

    const { conversationHeaders } = useSelector(chatbotSliceState)
    const dispatch = useDispatch()

    /**
     * Send to the chatbot the message written by the user
     * @param {string} message Message written by the user
     */
    const sendMessage = (message: string) => {
        if(socket !== null){
            (socket as WebSocket).send(
                JSON.stringify({
                    actionType: "WRITEACTION",
                    timestamp: Date.now(),
                    message: message
                })
            )
        }
    }

    useEffect(()=>{
        const webSocket = new WebSocket("ws://localhost:80/ws/chatbot")
    
        webSocket.onopen = () => {
            setConnectionStatus(true)
        }
    
        webSocket.onclose = () => {
            setConnectionStatus(false)
        }
    
        webSocket.onmessage = (event) => {
            const messageData = JSON.parse(event.data) as SocketData
            console.log(messageData)
            switch (messageData.actionType) {
                case "CONVERSATION_HEADERS_LOAD":
                    const conversationHeaders = messageData.conversationHeaders
                    dispatch(setConversationsHeaders(conversationHeaders))
                    break;
                case "NEW_CONVERSATION":
                    dispatch(addConversation(messageData.conversationHeader))
                    break;
                case "NEW_MESSAGE":
                    dispatch(addMessage(messageData.message))
                    if(Object.hasOwn(messageData, "conversation")){
                        dispatch(addConversation(messageData.conversation))
                    }
                    break;
                case "LOAD_MESSAGES":
                    dispatch(setMessages(messageData.messages))
                    break;
            }
        }
        setSocket(webSocket);
    }, [])

    useEffect(() => {
        if (isConnected && socket !== null) {
            socket.send(JSON.stringify({
                'ACTION': 'CHANGE_CONVERSATION',
                'id': id
            }))
        }
    }, [id])

    /**
     * Sets the chatbot ID
     * @param event 
     */
    const selectChabotID = (event: SelectChangeEvent) => {
        setID(event.target.value as unknown as number)
    }

    return <Dialog
        onClose={props.handleClose}
        open={props.isOpened}
        fullWidth
        maxWidth={false}
        sx={{
            borderRadius: 2,
            overflow: 'hidden',
            maxHeight: "calc(100vh-64px)",
            display: "flex",
            flexDirection: "column"
        }}
    >
        <DialogTitle>
            <Typography variant="h3">Chatbot BackupAI</Typography>
        </DialogTitle>
        <DialogContent
            sx={{
                overflowY: "auto",
                flexGrow: 1,
                display: "flex",
                flexDirection: "row"
            }}
        >
            <ChatbotDialogSelect
                id={id}
                handleChange={selectChabotID}
                headers={conversationHeaders}
            />
            <Divider orientation="vertical" />
            <ChatbotConversation
                sendMessage={sendMessage}
            />
        </DialogContent>
    </Dialog>
}