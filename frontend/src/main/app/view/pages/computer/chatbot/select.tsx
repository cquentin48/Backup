import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConversationHeader } from "../../../../controller/deviceMainInfos/chatbotSlice";
import { Add } from "@mui/icons-material";

interface ChatBotDialogSelectProps {
    /**
     * Currently selected chatbot ID
     */
    id: number;

    /**
     * When the user switch to a new conversation
     * @param {SelectChangeEvent} event event data
     */
    handleChange: (event: SelectChangeEvent) => void;

    /**
     * Every single conversation header list
     */
    headers: ConversationHeader[];
}

/**
 * Select form for the chatbot dialog
 * @returns {React.JSX.Element} rendered component
 */
export default function ChatbotDialogSelect (props: ChatBotDialogSelectProps): React.JSX.Element {
    return <Box
        sx={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column"
        }}
    >
        <Button variant="outlined" startIcon={<Add />}>
            Nouvelle conversation...
        </Button>
        {
            props.headers.map((header) => {
                return <Button variant="text">{header.label}</Button>
            })
        }
    </Box>
}