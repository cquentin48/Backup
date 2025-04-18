from django.contrib import admin

from .models import ChatbotSentence, ConversationModel, Sentence, SentenceEntityModel

# Register your models here.
admin.site.register(ChatbotSentence)
admin.site.register(ConversationModel)
admin.site.register(SentenceEntityModel)
