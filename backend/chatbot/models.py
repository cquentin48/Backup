from datetime import datetime
from typing import Literal, List, Union

from django.core.exceptions import ObjectDoesNotExist, SuspiciousOperation
from django.db import models

from opensearchpy import OpenSearch
from torch import Tensor

from server.utils import get_es_client
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


class BotAnswer(models.Model):
    id = models.AutoField(
        primary_key=True,
        verbose_name=LOCALE.load_localised_text("BOT_ANSWER_ID")
    )
    understood_data = models.CharField(
        verbose_name=LOCALE.load_localised_text("BOT_ANSWER_UNDERSTOOD_DATA")
    )
    found_data = models.CharField(
        verbose_name=LOCALE.load_localised_text("BOT_ANSWER_FOUND_DATA")
    )
    answer = models.ForeignKey(
        "ChatbotSentence",
        verbose_name=LOCALE.load_localised_text("BOT_ANSWER_TEXT"),
        on_delete=models.CASCADE,
        null=True
    )

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
    conversation = models.ForeignKey(
        ConversationModel,
        on_delete=models.PROTECT,
        verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT_RELATED_CONVERSATION"),
        null=True
    )
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


class Sentence:
    """
    Input data for elastic search storage
    """
    
    current_length = 0

    embedding:str
    """
    Sentence as embeddings.
    """

    sentence:str
    """
    Templated sentence
    """

    source:str
    """
    Source (if it originates from the documentation, ``/`` used as separators).
    """

    action:str
    """
    Action type (e.g. ``create``, ``update`` or ``delete``).
    """

    tags = str
    """
    Tags to check whether it is an action (and which kind of action).
    """

    @staticmethod
    def add_element(
        action:str, embedding: Tensor,
        sentence:str, source:str, tags:str, new_index:int):
        assert len(embedding) == 1024, "The embedding must have 1024 inputs"+\
            f", here it has {len(embedding)} inputs."
        client = get_es_client()
        if not client:
            client = OpenSearch(
            "http://embeddings:9200",
            use_ssl=False,
            verify_certs=False
        )
        client.index(
            "sentence_embeddings",
            body={
                "action":action,
                "sentence":sentence,
                "source":source,
                "tags":tags,
                "embedding": embedding.tolist()
            },
            id=new_index
        )
        client.indices.refresh(index="sentence_embeddings")


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

