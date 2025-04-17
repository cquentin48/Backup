import json

from typing import Literal

import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatbotConsumer(AsyncWebsocketConsumer):
    """
    Websocket communication class
    """

    async def connect(self):
        # pylint: disable=wrong-import-position
        from .models import ConversationModel
        """ Connect the client to the database.
        Check if user is connected before.
        """
        self.accept()
        self.dialog = None
        self.sentences = []
        self.timeout_task = asyncio.create_task(self.auto_disconnect())
        conversation_headers = await sync_to_async(ConversationModel.load_all_conversation_headers())
        self.send("Connected!")
        self.send_message("info", info=json.dumps({
            'actionType':'CONVERSATION_HEADERS_LOAD',
            'conversationHeaders':conversation_headers
        }))

    def send_message(self, status: Literal['error', 'info', 'warning', 'success'], **args):
        """ Sends a message to the connected client
        :type status: Literal
        :param status: Operation status (either ``error``, ``warning``, ``info``, ``success``)

        :type **args: dict
        :param **args: Extra arguments for the message
        """
        self.send(
            json.dumps(
                {
                    'status': status,
                    **args
                }
            )
        )

    def receive(self, text_data=None, bytes_data=None):
        """ Receive data function from the client socket

        :type text_data: str
        :param text_data: JSON data sent by the client

        :type bytes_data: bytes
        :param bytes_data: Bytes sent by the client (Unused here)
        """
        # pylint: disable=wrong-import-position
        from models import ConversationModel, ChatbotSentence
        data = json.loads(text_data)
        self.reset_timeout()
        match data['ACTION_TYPE']:
            case "INIT_CONVERSATION":
                self.dialog = ConversationModel.gets_or_create_conversation(
                    data["dialogID"])
                self.sentences = ChatbotSentence.get_sentences(self.dialog.id)
            case "WRITE_ACTION":
                self.sentences.append(ChatbotSentence.add_new_sentence(
                    "HUMAN",
                    data["text"],
                    self.dialog,
                    data["timestamp"]
                ))
            case _:
                self.send_message("error", info=json.dumps(
                    {'message': 'UNSUPPORTED_ACTION'}))

    def reset_timeout(self):
        """
        Reset the timeout in case of user activity
        """
        self.timeout_task.cancel()
        self.timeout_task = asyncio.create_task(self.auto_disconnect())

    async def auto_disconnect(self):
        """
        Auto disconnect if the user is not sending any data for 15 minutes
        """
        await asyncio.sleep(15*60)
        await self.send_message("warning", infos=json.dumps({'message': 'TIMEOUT_DISCONNECT'}))
        await self.close()
