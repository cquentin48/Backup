from django.db import models
from server.settings import LOCALE

# Create your models here.


class Device(models.Model):
    """
    Device containing list of libraries
    """

    id = models.AutoField(primary_key=True)
    """
    Database Device ID
    """
    
    name = models.CharField(
        verbose_name=LOCALE.load_localised_text("DEVICE_NAME"),
        max_length=64
    )
    """
    Device name
    """
    
    processor = models.CharField(
        verbose_name=LOCALE.load_localised_text("DEVICE_PROCESSOR"),
        max_length=64
    )
    """
    Device processor model
    """
    
    cores = models.IntegerField(
        verbose_name=LOCALE.load_localised_text("DEVICE_CORES_COUNT")
    )
    """
    How many cores does the device has
    """
    
    memory = models.IntegerField(
        verbose_name=LOCALE.load_localised_text("DEVICE_MEMORY_VALUE")
    )
    """
    RAM size
    """
    
    operating_system = models.CharField(
        verbose_name=LOCALE.load_localised_text("DEVICE_OPERATING_SYSTEM"),
        max_length=64
    )
    """
    OS name
    """
    
    def __str__(self) -> str:
        return f"{self.name} ({self.operating_system})"

class PythonVenv(models.Model):
    """
    Python virtual environment
    """
    id = models.AutoField(primary_key=True)
    
    name = models.CharField(
        verbose_name=LOCALE.load_localised_text("VENV_NAME"),
        max_length=64
    )
    """
    Python virtual environment name (located between the parenthesis in the terminal)
    """
    
    path = models.CharField(
        verbose_name=LOCALE.load_localised_text("VENV_PATH"),
        max_length=128
    )
    """
    Python virtual environment location in the device
    """
    
    related_device = models.ForeignKey(
        to=Device,
        on_delete=models.PROTECT,
        verbose_name=LOCALE.load_localised_text("VENV_RELATED_DEVICE"),
        default=-1,
        null=True,
        blank=True
    )
    """
    Python virtual environment related device
    """
    

class Package(models.Model):
    """
    Package data from linux like operating system (Linux and MacOSX)
    """
    id = models.AutoField(primary_key=True)

    name = models.CharField(
        verbose_name=LOCALE.load_localised_text("SOURCE_PACKAGE_NAME"),
        max_length=255
    )
    """
    Source package name
    """

    type = models.CharField(
        verbose_name=LOCALE.load_localised_text("SOURCE_TYPE"),
        max_length=64
    )
    """
    Package source type (installed program, application store, custom script, ...)
    """

    pre_install_lines = models.TextField(
        verbose_name=LOCALE.load_localised_text(
            "SOURCE_PACKAGE_PREINSTALL_LINES"),
        blank=True
    )
    """
    Lines to run before installing the package TODO : replace it with either a repository or a set of instruction
    """

    def __str__(self) -> str:
        return self.name


class ChosenVersion(models.Model):
    id = models.AutoField(primary_key=True)

    chosen_version = models.CharField(
        verbose_name=LOCALE.load_localised_text("CHOSEN_VERSION_NAME"),
        max_length=64
    )
    """
    Which version has been chosen
    """

    package = models.ForeignKey(
        to=Package,
        verbose_name=LOCALE.load_localised_text(
            "CHOSEN_VERSION_RELATED_PACKAGE"),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        default=-1
    )
    """
    Related package
    """
    
    device = models.ForeignKey(
        to=Device,
        verbose_name=LOCALE.load_localised_text(
            "CHOSEN_VERSION_DEVICE"
        ),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        default=-1
    )
    """
    Device with the chosen version of the related package
    """

    def __str__(self) -> str:
        return f"{self.package.name} - {str(self.chosen_version)}"
