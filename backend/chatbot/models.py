from datetime import datetime
from typing import Literal, List, Union

from django.core.exceptions import ObjectDoesNotExist, SuspiciousOperation
from django.db import models

from opensearchpy import OpenSearch
from torch import Tensor

from server.utils import get_embeddings_client
from tools.localisation import Localisation

# Create your models here.
LOCALE = Localisation("en-us")


class ConversationModel(models.Model):
    id = models.AutoField(primary_key=True,
                          verbose_name=LOCALE.load_localised_text("CHATBOT_CONV_ID"))
    created_at = models.DateTimeField(default=datetime.now(), verbose_name=LOCALE.load_localised_text("CHATBOT_CONV_CREATED_AT"))
    title = models.CharField(max_length=255, default="", verbose_name=LOCALE.load_localised_text("CHATBOT_CONV_TITLE"))


class Message(models.Model):
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
        verbose_name=LOCALE.load_localised_text(
            "CHATBOT_INPUT_RELATED_CONVERSATION"),
        null=True
    )
    timestamp = models.DateTimeField(
        verbose_name=LOCALE.load_localised_text("CHATBOT_TIMESTAMP"),
        default=datetime.now()
    )

    def __str__(self):
        related_conv_id = self.conversation.id
        return f"Conversation {related_conv_id} - {self.timestamp}"


class Sentence:
    """
    Input data for elastic search storage
    """

    current_length = 0

    embedding: str
    """
    Sentence as embeddings.
    """

    sentence: str
    """
    Templated sentence
    """

    source: str
    """
    Source (if it originates from the documentation, ``/`` used as separators).
    """

    action: str
    """
    Action type (e.g. ``create``, ``update`` or ``delete``).
    """

    tags = str
    """
    Tags to check whether it is an action (and which kind of action).
    """

    @staticmethod
    def add_element(
            action: str, embedding: Tensor,
            sentence: str, source: str, tags: str, new_index: int):
        assert len(embedding) == 1024, "The embedding must have 1024 inputs" +\
            f", here it has {len(embedding)} inputs."
        client = get_embeddings_client()
        if not client:
            client = OpenSearch(
                "http://embeddings:9200",
                use_ssl=False,
                verify_certs=False
            )
        client.index(
            "sentence_embeddings",
            body={
                "action": action,
                "sentence": sentence,
                "source": source,
                "tags": tags,
                "embedding": embedding.tolist()
            },
            id=new_index
        )
        client.indices.refresh(index="sentence_embeddings")

    @staticmethod
    def count():
        client = get_embeddings_client()
        if not client:
            client = OpenSearch(
                "http://embeddings:9200",
                use_ssl=False,
                verify_certs=False
            )
        index_name = "sentence_embeddings"
        return client.count(index=index_name)['count']


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
