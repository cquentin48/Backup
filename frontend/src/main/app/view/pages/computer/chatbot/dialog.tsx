import React, {useEffect, useState} from "react";

import { AccountCircle, Psychology, PsychologyAlt, SendSharp } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, SelectChangeEvent, TextField } from "@mui/material";
import ChatbotDialogSelect from "./select";
import { useDispatch, useSelector } from "react-redux";
import chatbotSlice, {chatbotSliceState, ChatbotSliceState} from "../../../../controller/deviceMainInfos/chatbotSlice";
import { addMessage, setConversationsHeaders, setMessages, addConversation } from "../../../../controller/deviceMainInfos/chatbotSlice";

/**
 * Props passed from the chatbot toggle button
 */
interface ChatBotDialogProps{
    /**
     * If the dialog is opened or not
     */
    isOpened:boolean;

    /**
     * Handle close function
     */
    handleClose: () => void;
}

/**
 * Socket message data
 */
interface SocketData{
    /**
     * Socket message action type
     */
    actionType:string;

    /**
     * Socket message object data
     */
    [clé:string]:any;
}

/**
 * Dialog for the chatbot
 * @param {ChatBotDialogProps} props Is opened state and close dialog passed from the button
 * @returns {React.JSX.Element} rendered component
 */
export default function ChatBotDialog(props: ChatBotDialogProps) : React.JSX.Element{
    const [id, setID] = React.useState(-1)
    const [isConnected, setConnectionStatus] = useState(false)
    const { messages, conversationHeaders } = useSelector(chatbotSliceState)
    const dispatch = useDispatch()
    const webSocket = new WebSocket("ws://backend:8000/backup/chatbot")

    useEffect(()=>{
        webSocket.send(JSON.stringify({
            'ACTION':'CHANGE_CONVERSATION',
            'id':id
        }))
    },[id])

    useEffect(()=>{
        webSocket.onopen = () => {
            setConnectionStatus(true)
        }
    
        webSocket.onclose = () => {
            setConnectionStatus(false)
        }
    
        webSocket.onmessage = (event) => {
            const messageData = (event.data) as SocketData
            switch(messageData.actionType){
                case "CONVERSATION_HEADERS_LOAD":
                    const conversationHeaders = messageData.conversationHeaders
                    dispatch(setConversationsHeaders(conversationHeaders))
                    break;
                case "NEW_CONVERSATION":
                    dispatch(addConversation(messageData.conversationHeader))
                    break;
                case "NEW_MESSAGE":
                    dispatch(addMessage(messageData.message))
                    break;
                case "LOAD_MESSAGES":
                    dispatch(setMessages(messageData.messages))
                    break;
            }
        }
    }, [])
    
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
    >
        <DialogTitle>Chatbot BackupAI</DialogTitle>
        <DialogContent>
            <ChatbotDialogSelect
                id={id}
                handleChange={selectChabotID}
                headers={conversationHeaders}
            />
            {
                messages.map((message)=>{
                    let icon;
                    if(message.agent == "USER"){
                        icon = <AccountCircle/>
                    }else{
                        icon = <PsychologyAlt/>
                    }
                    return <Box>
                        {icon}
                        {message.text}
                    </Box>
                })
            }
            <TextField
                id="chatbot-input"
                label="Question posée"
                defaultValue="Écrivez votre demande ici..."
            />
            <IconButton>
                <SendSharp/>
            </IconButton>
        </DialogContent>
    </Dialog>
}