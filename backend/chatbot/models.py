from datetime import datetime
from typing import Literal, List, Union
from uuid import uuid4

from django.core.exceptions import ObjectDoesNotExist, SuspiciousOperation
from django.db import models

from elasticsearch_dsl import Document, DenseVector, Text


from tools.localisation import Localisation

# Create your models here.
LOCALE = Localisation("en-us")


class ConversationModel(models.Model):
    id = models.AutoField(primary_key=True,
                          verbose_name=LOCALE.load_localised_text("CHATBOT_CONV_ID"))

    @staticmethod
    def gets_or_create_conversation(conversation_id: Union[str, None]) -> "ConversationModel":
        """ Returns the conversation with the id given in the database. If not exists,
        creates a new one.
        :type conversation_id: Union[str,None]
        :param conversation_id: ID of the conversation stored in the database.

        :rtype: ConversationModel
        """
        if not conversation_id:
            return ConversationModel.objects.create()
        try:
            return ConversationModel.objects.get(id=conversation_id)
        except ObjectDoesNotExist as _:
            return ConversationModel.objects.create()

    @staticmethod
    def load_all_conversation_headers() -> dict:
        """
        Loads every conversation header

        :rtype: dict Every conversation headers
        """
        conversations = list(ConversationModel.objects.all())
        conversation_headers = []
        for conversation in conversations:
            dialogs = list(ChatbotSentence.objects.filter(
                conversation=conversation))
            if len(dialogs) > 1:
                count = f"{len(dialogs)} conversations"
                last_dialog_timestamp = dialogs[-1].timestamp.strftime(
                    "%d %B %Y à %H:%M")
            elif len(dialogs) == 1:
                count = f"{len(dialogs)} conversation"
                last_dialog_timestamp = dialogs[-1].timestamp.strftime(
                    "%d %B %Y à %H:%M")
            else:
                count = "Aucune conversation"
                last_dialog_timestamp = ""
            conversation_headers.append(
                {
                    "id": conversation.id,
                    "text": f"Dialog #{conversation.id} - {count} - (dernière maj : {last_dialog_timestamp})"
                }
            )
        return conversation_headers

    def __str__(self):
        return f"Conversation - {self.id}"


class ChatbotSentence(models.Model):
    AGENTS = {
        "BOT": 'CHATBOT_AGENT',
        "HUMAN": 'USER'
    }
    id = models.AutoField(
        primary_key=True,
        verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT_ID")
    )
    agent = models.CharField(
        choices=AGENTS, verbose_name=LOCALE.load_localised_text("CHATBOT_AGENT"))
    text = models.CharField(
        verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT"))
    conversation = models.ForeignKey(ConversationModel, on_delete=models.PROTECT,
                                     verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT_RELATED_CONVERSATION"))
    timestamp = models.DateTimeField(
        verbose_name=LOCALE.load_localised_text("CHATBOT_TIMESTAMP"))
    datetime.now()

    @staticmethod
    def add_new_sentence(
        agent: Literal["HUMAN", "AGENT"],
        text: str, conversation: ConversationModel, timestamp: datetime
    ) -> "ChatbotSentence":
        """ Description
        :type agent: Literal["HUMAN","AGENT"]
        :param agent: User or the bot

        :type text: str
        :param text: Sentence written by the agent

        :type conversation: ConversationModel
        :param conversation: Current conversation

        :type timestamp: datetime
        :param timestamp: Timestamp of the written message

        :raises: SuspiciousOperation Suspicious operation
        (multiple load at the same time)

        :rtype: ChatbotSentence
        """
        try:
            _ = ChatbotSentence.objects.get(
                agent=agent,
                text=text,
                conversation=conversation,
                timestamp=timestamp
            )
            raise SuspiciousOperation(
                "You are trying to write again the same sentence at the same time."
            )
        except ObjectDoesNotExist as _:
            if not conversation:
                conversation = ConversationModel.objects.create()
            return ChatbotSentence.objects.create(
                agent=agent,
                text=text,
                conversation=conversation,
                timestamp=timestamp
            )

    @staticmethod
    def get_sentences(chatbot_id: int) -> List["ChatbotSentence"]:
        """ Loads every sentences written both by the agent and the user
        :type chatbot_id: int
        :param chatbot_id: ID of the chatbot sentence

        :rtype: List[ChatbotSentence]
        """
        try:
            conversation = ConversationModel.objects.get(id=chatbot_id)
            return ChatbotSentence.objects.filter(conversation=conversation)
        except ObjectDoesNotExist as _:
            return []

    def __str__(self):
        related_conv_id = self.conversation.id
        return f"Conversation {related_conv_id} - {self.timestamp}"


class Sentence(Document):
    """
    Input data for elastic search storage
    """

    embeddings = DenseVector(dims=1024)
    """
    Sentence as embeddings.
    """

    sentence = Text()
    """
    Templated sentence
    """

    source = Text()
    """
    Source (if it originates from the documentation, ``/`` used as separators).
    """

    action = Text()
    """
    Action type (e.g. ``create``, ``update`` or ``delete``).
    """

    tags = Text()
    """
    Tags to check whether it is an action (and which kind of action).
    """

    @staticmethod
    def validate(inputs: dict[str, str]):
        """ Description
        :type inputs: dict[str,str]
        :param inputs: Properties set for the object creation

        :raises: AssertionError -> Bad instantiation
        """
        ALLOWED_KEYS = [
            ['action', 'tags'],
            ['source', 'tags'],
            []
        ]
        if inputs.keys() not in ALLOWED_KEYS:
            raise AssertionError("You lack enough properties to store in the database. " +
                                 "You must have either the action and the tags, source and tags, " +
                                 "or nothing.")
        for key in inputs.keys():
            if not isinstance(inputs[key], str):
                raise AssertionError(
                    f"The value {inputs[key]} located in the {key} is not a string value!")
        if '//' in inputs['source']:
            raise AssertionError(
                "You can't have a empty source between two other sources!")
        if inputs['source'].endswith('/'):
            raise AssertionError(
                "You can't have a source list ending with an empty value!")

    class Index:
        """
        Index subclass
        """
        name = "embeddings"

    class Meta:
        """
        Miscellanous data
        """
        id = uuid4()


class SentenceEntityModel(models.Model):
    """
    Sentence entity found by the model and stored in the database
    """

    input_type = models.CharField(
        verbose_name=LOCALE.load_localised_text("CHATBOT_ENTITY_INPUT_TYPE"))
    """
    Entity object type
    """

    value = models.CharField(
        verbose_name=LOCALE.load_localised_text("CHATBOT_ENTITY"))
    """
    Entity found by the model
    """

    @staticmethod
    def create(input_type: str, value: str):
        """ Create a sentence and saves it
        :type input_type: str
        :param input_type: Type of input (documentation or action)

        :type value: str
        :param value: Found value
        """
        return SentenceEntityModel.objects.create(
            input_type=input_type,
            value=value
        )
