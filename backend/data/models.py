from django.db import models
from server.settings import LOCALE


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

    memory = models.BigIntegerField(
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
    Lines to run before installing the package
    """

    def __str__(self) -> str:
        return self.name


class Repository(models.Model):
    """
    Ubuntu repositories
    """

    id = models.AutoField(primary_key=True, help_text="Primary key")
    """
    Database Primary key
    """

    sources_lines = models.TextField(help_text="sources.list lines to add")
    """
    Instruction lines for the repository found in the file ``/etc/apt/sources.list``
    """

    name = models.CharField(
        verbose_name=LOCALE.load_localised_text("REPOSITORY_NAME"),
        max_length=128,
        null=False,
        default="My repository"
    )

    def __str__(self) -> str:
        return f"{self.id} - {self.name}"


class ChosenVersion(models.Model):
    """
    Chosen version of a software
    """
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

    def __str__(self) -> str:
        return f"{self.package.name} - {str(self.chosen_version)}"


class Shell(models.Model):
    """
    POSIX shell storage class
    """

    id = models.AutoField(primary_key=True)
    """
    Primary key
    """

    sh_type = models.CharField(
        max_length=16, verbose_name=LOCALE.load_localised_text("SHELL_TYPE"))
    """
    Shell Type (e.g. Bash, Oh-my-zsh, ...)
    """

    def __str__(self):
        # How many lines are there in the history and configuration lines
        history_lines_count = CommandHistory.objects.filter(
            related_shell=self).count()
        configuration_lines_count = Command.objects.filter(
            related_shell=self).count()

        # Format the counts
        history_lines_format = f"{history_lines_count}" +\
            f" {'lines' if history_lines_count > 1 else 'line'}"
        configuration_lines_format = f"{configuration_lines_count} " +\
            f"{'lines' if configuration_lines_count > 1 else 'line'}"

        return f"{self.sh_type} - {history_lines_format} | {configuration_lines_format}"


class Command(models.Model):
    """
    Command database class manager
    """

    id = models.AutoField(primary_key=True)
    """
    Primary key
    """

    prefix = models.CharField(
        max_length=64, verbose_name=LOCALE.load_localised_text("COMMAND_PREFIX"))
    """
    Prefix of the command (e.g. ``ls`` for ``ls -ltr``)
    """

    arguments = models.TextField(
        verbose_name=LOCALE.load_localised_text("COMMAND_ARGUMENTS"))
    """
    Arguments of the command (e.g ``-ltr`` for ``ls -ltr``)
    """

    related_shell = models.ForeignKey(
        to=Shell,
        on_delete=models.PROTECT,
        verbose_name=LOCALE.load_localised_text("SHELL_CONFIG"),
        null=True
    )
    """
    Shell containing the command history
    """


class CommandHistory(models.Model):
    """
    History of commands done in a device
    """

    id = models.AutoField(primary_key=True)
    """
    Primary key
    """

    command = models.ForeignKey(
        Command,
        verbose_name=LOCALE.load_localised_text("COMMAND_HISTORY_COMMAND"),
        on_delete=models.PROTECT
    )
    """
    Command done
    """

    timestamp = models.DateTimeField(
        LOCALE.load_localised_text("COMMAND_HISTORY_TIMESTAMP"),
    )
    """
    Timestamp of the command
    """

    related_shell = models.ForeignKey(
        to=Shell,
        on_delete=models.PROTECT,
        verbose_name=LOCALE.load_localised_text("SHELL_HISTORY"),
        null=True
    )
    """
    Shell containing the command history
    """


class Snapshot(models.Model):
    """
    Save Database manager class
    """

    id = models.AutoField(primary_key=True, help_text="Save Database ID")
    """
    Index for the database save object
    """

    related_device = models.ForeignKey(
        to=Device,
        verbose_name=LOCALE.load_localised_text(
            "SAVE_RELATED_DEVICE"
        ),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        default=-1
    )
    """
    Device on which the save was performed
    """

    save_date = models.DateField(
        verbose_name=LOCALE.load_localised_text(
            "SAVE_DATE"
        )
    )
    """
    Saved date
    """

    versions = models.ManyToManyField(
        to=ChosenVersion,
        verbose_name=LOCALE.load_localised_text("SAVE_RELATED_VERSIONS")
    )
    """
    Packages list within the save
    """

    repositories = models.ManyToManyField(
        to=Repository,
        verbose_name=LOCALE.load_localised_text("SAVE_RELATED_REPOSITORIES")
    )
    """
    Repositories within the save
    """

    repositories_list = models.TextField(
        verbose_name=LOCALE.load_localised_text("SAVE_REPOSITORIES"),
        default=""
    )
    """
    Repositories in the repositories list file
    """

    def __str__(self) -> str:
        return f"{str(self.related_device)} : {str(self.save_date)}"
