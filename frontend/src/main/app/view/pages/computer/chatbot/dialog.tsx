import React from "react";

import { SendSharp } from "@mui/icons-material";
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from "@mui/material";

interface ChatBotDialogProps{
    isOpened:boolean;
    handleClose: () => void;
}

/**
 * Dialog for the chatbot
 * @param {ChatBotDialogProps} props Is opened state and close dialog passed from the button
 * @returns {React.JSX.Element} rendered component
 */
export default function ChatBotDialog(props: ChatBotDialogProps) : React.JSX.Element{
    return <Dialog
        onClose={props.handleClose}
        open={props.isOpened}
    >
        <DialogTitle>Chatbot BackupAI</DialogTitle>
        <DialogContent>
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