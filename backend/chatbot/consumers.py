import json
from json.decoder import JSONDecodeError
import logging

from typing import Literal

import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatbotConsumer(AsyncWebsocketConsumer):
    """
    Websocket communication class
    """
    logging = logging.basicConfig(
        level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

    async def connect(self):
        # pylint: disable=wrong-import-position
        from .models import ConversationModel
        """ Connect the client to the database.
        Check if user is connected before.
        """
        await self.accept()
        client_ip, client_port = self.scope['client']
        self.dialog = None
        self.sentences = []
        logging.info(
            f"Connected from ip adress {client_ip} with port {client_port}!")

        conversation_headers = await sync_to_async(ConversationModel.load_all_conversation_headers)()
        logging.info("Sentences loaded")
        self.send("Connected!")
        logging.info("Message sent!")
        await self.send(json.dumps(
            {'status': 'success',
                'data':
                {
                    'actionType': 'CONVERSATION_HEADERS_LOAD',
                    'conversationHeaders': conversation_headers
                }
             })
        )
        self.timeout_task = asyncio.create_task(self.auto_disconnect())

    def disconnect(self, code):
        logging.error(f"Disconnect with code {code}")
        return super().disconnect(code)

    async def receive(self, text_data=None):
        """ Receive data function from the client socket

        :type text_data: str
        :param text_data: JSON data sent by the client

        :type bytes_data: bytes
        :param bytes_data: Bytes sent by the client (Unused here)
        """
        # pylint: disable=wrong-import-position
        from .models import ConversationModel, ChatbotSentence
        try:
            data = json.loads(text_data)
            logging.info(f"Received data : {data}")
            self.reset_timeout()
            match data['actionType']:
                case "INITCONVERSATION":
                    self.dialog = ConversationModel.gets_or_create_conversation(
                        data["dialogID"])
                    self.sentences = ChatbotSentence.get_sentences(
                        self.dialog.id)
                case "WRITEACTION":
                    self.sentences.append(ChatbotSentence.add_new_sentence(
                        "HUMAN",
                        data["text"],
                        self.dialog,
                        data["timestamp"]
                    ))
                case _:
                    await self.send(json.dumps(
                        {
                            "status": "error",
                            'data': {
                                'message': 'UNSUPPORTED_ACTION'
                            }
                        }
                    ))
        except JSONDecodeError as _:
            logging.error(f"Invalid received data : {text_data}")
            await self.send(
                json.dumps(
                    {
                        'status': 'error',
                        "data": {
                            "message": "JSON_OBJECT_REQUIRED"
                        }
                    }
                )
            )

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
        logging.error("Disconnect!")
        await self.send(
            json.dumps(
                {"status": "warning", "data": {'message': 'TIMEOUT_DISCONNECT'}}
            )
        )
        await self.close()
