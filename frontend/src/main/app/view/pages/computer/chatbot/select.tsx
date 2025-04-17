import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConversationHeader } from "../../../../controller/deviceMainInfos/chatbotSlice";

interface ChatBotDialogSelectProps{
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
export default function ChatbotDialogSelect(props: ChatBotDialogSelectProps):React.JSX.Element{
    return <Box>
        <FormControl fullWidth>
            <InputLabel id="chatbotdialog-select-label">Current chabot</InputLabel>
            <Select
                labelId="chatbotdialog-select-label"
                id="chatbotdialog-select"
                value={props.id}
            >
                <MenuItem value={-1}>Nouveau dialogue...</MenuItem>
                {
                    props.headers.map((header)=>{
                        return <MenuItem value={header.id}>{header.label}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    </Box>
}