from django.contrib import admin
from .models import ChosenVersion, Device, Package

# Register your models here.
admin.site.register(ChosenVersion)
admin.site.register(Device)
admin.site.register(Package)
