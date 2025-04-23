import json
from datetime import datetime
from json.decoder import JSONDecodeError
import logging
import traceback

from threading import Timer

from channels.generic.websocket import WebsocketConsumer


class ChatbotConsumer(WebsocketConsumer):
    """
    Websocket communication class
    """
    logging = logging.basicConfig(
        level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

    def connect(self):
        # pylint: disable=wrong-import-position
        from .models import ConversationModel
        """ Connect the client to the database.
        Check if user is connected before.
        """
        self.accept()
        client_ip, client_port = self.scope['client']
        self.dialog = None
        self.sentences = []
        self.new_dialog = True
        logging.info(
            f"Connected from ip adress {client_ip} with port {client_port}!")

        conversation_headers = ConversationModel.load_all_conversation_headers()
        logging.info("Sentences loaded")
        self.send(
            json.dumps(
                {
                    "status": "success",
                    "actionType": "CONNECT"
                }
            )
        )
        logging.info("Message sent!")
        self.send(json.dumps(
            {'status': 'success',
                'data':
                {
                    'actionType': 'CONVERSATION_HEADERS_LOAD',
                    'conversationHeaders': conversation_headers
                }
             })
        )
        self.timeout_task = Timer(60*15, self.auto_disconnect)
        self.timeout_task.start()

    def disconnect(self, code):
        logging.error(f"Disconnect with code {code}")
        return super().disconnect(code)

    def load_conversation_headers(self):
        # pylint: disable=wrong-import-position
        from models import ConversationModel, ChatbotSentence
        conversations = ConversationModel.objects.all()
        headers = []
        for conversation in conversations:
            last_message = ChatbotSentence.objects.filter(
                conversation=conversation).order_by('-timestamp')[0]
            headers.append({
                'id': conversation.id,
                'timestamp': last_message.timestamp.timestamp,
                'label': 'Device data managment'
            })
        return headers

    def receive(self, text_data=None):
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
                    self.send(json.dumps(
                        {
                            "actionType": "CONVERSATION_HEADERS_LOAD",
                            "conversationHeaders": self.load_conversation_headers()
                        }
                    ))
                    logging.info("Messages header sent!")
                case "WRITEACTION":
                    new_message = ChatbotSentence.add_new_sentence(
                        "USER",
                        data["message"],
                        self.dialog,
                        datetime.fromtimestamp(data["timestamp"]/1e3)
                    )
                    self.sentences.append(new_message)
                    if self.dialog is None:
                        self.dialog = new_message.conversation
                        logging.debug("No previous self dialog!")
                    self.send(json.dumps(
                        {
                            "actionType": "NEW_MESSAGE",
                            "message": {
                                "message": new_message.text,
                                "agent": new_message.agent,
                                "timestamp": new_message.timestamp.timestamp()
                            },
                            ** (
                                {
                                    "conversation": {
                                        "id": self.dialog.id,
                                        "label": "Device manager"
                                    }
                                } if self.new_dialog else {}
                            )
                        }
                    ))
                    self.new_dialog = False
                    logging.info("New message sent!")
                case _:
                    self.send(json.dumps(
                        {
                            "actionType": "UNSUPPORTED_ACTION",
                            'data': {
                                'message': 'UNSUPPORTED_ACTION'
                            }
                        }
                    ))
                    logging.info("Error message sent!")
        except JSONDecodeError as _:
            logging.error(traceback.format_exc())
            logging.error(f"Invalid received data : {text_data}")
            message_sent = json.dumps({
                'status': 'error',
                "data": {
                    "message": "JSON_OBJECT_REQUIRED"
                }
            })
            self.send(
                message_sent
            )
        except TypeError as _:
            logging.error(traceback.format_exc())
            self.send(
                json.dumps({
                    'status': 'error',
                    "data": {
                        "message": "INVALID_DATA_SENT"
                    }
                })
            )
        except _:
            self.send(
                json.dumps({
                    'status': 'error',
                    "data": {
                        "message": "SERVER_ERROR"
                    }
                })
            )

    def reset_timeout(self):
        """
        Reset the timeout in case of user activity
        """
        self.timeout_task.cancel()
        self.timeout_task = Timer(10, self.auto_disconnect)

    def auto_disconnect(self):
        """
        Auto disconnect if the user is not sending any data for 15 minutes
        """
        logging.error("Disconnect!")
        self.send(
            json.dumps(
                {"status": "warning", "data": {'message': 'TIMEOUT_DISCONNECT'}}
            )
        )
        self.close()
