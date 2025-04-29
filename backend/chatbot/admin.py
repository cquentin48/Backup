from django.contrib import admin

from .models import Message, ConversationModel, Sentence, SentenceEntityModel

# Register your models here.
admin.site.register(Message)
admin.site.register(ConversationModel)
admin.site.register(SentenceEntityModel)
