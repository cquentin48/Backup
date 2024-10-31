from django.contrib import admin
from .models import ChosenVersion, Command, CommandHistory, Device, Package, Repository, Save

# Register your models here.
admin.site.register(Command)
admin.site.register(CommandHistory)
admin.site.register(ChosenVersion)
admin.site.register(Device)
admin.site.register(Package)
admin.site.register(Repository)
admin.site.register(Save)
