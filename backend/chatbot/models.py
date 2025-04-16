from django.db.models import AutoField, CharField, DateTimeField, ForeignKey, Model, PROTECT
from pgvector.django import VectorField

from server.settings import LOCALE

# Create your models here.
class Conversation(Model):
    id = AutoField(primary_key=True, verbose_name=LOCALE.load_localised_text("CHATBOT_CONV_ID"))
    
    def __str__(self):
        return f"Conversation - {id}"

class ChatbotInput(Model):
    AGENTS = {
        "BOT": 'CHATBOT_AGENT',
        "HUMAN": 'USER'
    }
    id = AutoField(primary_key=True, verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT_ID"))
    agent = CharField(choices=AGENTS, verbose_name=LOCALE.load_localised_text("CHATBOT_AGENT"))
    text = CharField(verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT"))
    conversation = ForeignKey(Conversation, on_delete=PROTECT, verbose_name=LOCALE.load_localised_text("CHATBOT_INPUT_RELATED_CONVERSATION"))
    timestamp = DateTimeField(verbose_name=LOCALE.load_localised_text("CHATBOT_TIMESTAMP"))
    
    def __str__(self):
        related_conv_id = self.conversation.id
        return f"Conversation {related_conv_id} - {self.timestamp}"
    
    
class Sentence(Model):
    tags = CharField(verbose_name=LOCALE.load_localised_text("SENTENCE_TAGS"))
    sentence = CharField(verbose_name=LOCALE.load_localised_text("RELATED_SENTENCE"))
    embedding = VectorField(
        dimensions=1024,
        help_text=LOCALE.load_localised_text("SENTENCE_EMBEDDING"),
        null=True,
        blank=True
    )