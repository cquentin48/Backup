import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type AppState } from "../store";

/**
 * Dialog message
 */
export interface MessageDialog {
    /**
     * Whether it is a user or the bot
     */
    agent: "USER" | "AGENT";

    /**
     * Writtent text
     */
    text: string;
}

/**
 * Conversation header
 */
export interface ConversationHeader{
    /**
     * Conversation header label
     */
    label: string;

    /**
     * ID of the conversation stored in the database
     */
    id: number;
}

/**
 * Filter slice state
 */
export interface ChatbotSliceState {
    messages: MessageDialog[];
    conversationHeaders: ConversationHeader[];
}

/**
 * Chatbot slice initial state
 */
export const chatbotInitialState: ChatbotSliceState = {
    messages: [],
    conversationHeaders: []
}

/**
 * Filter manager redux slice
 */
export const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: chatbotInitialState,
    reducers: {
        /**
         * Adds every conversation header to the slice state
         * @param {ChatbotSliceState} state Current slice state
         * @param {PayloadAction<string[]>} action Fetched conversation headers from the websocket
         */
        setConversationsHeaders: (state, action: PayloadAction<ConversationHeader[]>) => {
            state.conversationHeaders = []
            action.payload.forEach((header)=>{
                state.conversationHeaders.push()
            })
        },

        /**
         * Adds a new conversation to the slice state when the user is creating one in the dialog.
         * @param {ChatbotSliceState} state Current slice state
         * @param {PayloadAction<string>} action Dialog header
         */
        addConversation: (state, action: PayloadAction<ConversationHeader>) => {
            state.conversationHeaders.push(
                action.payload
            )
        },

        /**
         * Adds every dialog previously set inside the slice
         * @param {ChatbotSliceState} state Current filter slice state
         * @param {PayloadAction<MessageDialog[]>} action Messages to add
         */
        setMessages: (state, action: PayloadAction<MessageDialog[]>) => {
            state.messages = []
            action.payload.forEach((message) => {
                state.messages.push(
                    message
                )
            })
        },

        /**
         * Adds a new message written either by the user or the agent
         * @param {ChatbotSliceState} state Current slice state
         * @param {PayloadAction<MessageDialog>} action New message
         */
        addMessage: (state, action: PayloadAction<MessageDialog>) => {
            state.messages.push(
                action.payload
            )
        }
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const chatbotSliceState = (state: AppState) => state.chatbot;
export default chatbotSlice.reducer
export const { addMessage, setMessages, addConversation, setConversationsHeaders } = chatbotSlice.actions
