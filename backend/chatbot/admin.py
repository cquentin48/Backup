from django.contrib import admin

from .models import ChatbotInput, Conversation

# Register your models here.
admin.site.register(ChatbotInput)
admin.site.register(Conversation)
