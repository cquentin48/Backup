import json

from typing import Literal

from channels.generic.websocket import WebsocketConsumer

from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist



class BackupImportConsumer(WebsocketConsumer):
    """
    Websocket communication class
    """

    def connect(self):
        """ Connect the client to the database.
        Check if user is connected before.
        """
        self.accept()
        self.send("Connected!")

    def send_message(self, status: Literal['error', 'info', 'warning', 'success'], **args):
        """ Sends a message to the connected client
        :type status: Literal
        :param status: Operation status (either ``error``, ``warning``, ``info``, ``success``)

        :type **args: dict
        :param **args: Extra arguments for the message
        """
        self.send(
            json.dumps(
                {
                    'status': status,
                    **args
                }
            )
        )

    def append_new_device(self, device_infos: dict):
        """
        Adds a new device to the database (TODO: migrate it towards another class)
        """
        from .models import Device # pylint: disable=import-outside-toplevel
        return Device.objects.create(
            **device_infos
        )

    def append_libraries_chosen_version(self, packages: dict, library_name: str):
        """ Append every libraries chosen version to the database
        :type packages: dict
        :param packages:

        :type library_name: str
        :param library_name: Name of the library

        :type device: Device
        :param device: COmputer equipement performing the save
        """
        infos = {
            'state': 'init',
            'total': len(packages),
            'desc': f'{library_name} packages import'
        }

        self.send_message(status='info', type='progress_bar',
                          infos=json.dumps(infos))

        versions = []
        for package_index in packages:
            data = packages[package_index]
            versions.append(
                self.append_library(
                    data['Package'], data['Version'], library_name)
            )

            self.send_message(
                status='info',
                type='progress_bar',
                infos=json.dumps(
                    {'state': 'update', 'index': package_index})
            )

        return versions

    def append_library(self, package_name: str, version: str, package_type: str):
        """ Append library alongside the package inside the database

        :type package_name: str
        :param package_name: Package name

        :type version: str
        :param version: Package version (e.g. ``1.0.5``)

        :type package_type: str
        :param package_type: Type of package (e.g. ``snap package``, ``apt package``)

        :type device: Device
        :param device: Related package
        """
        from .models import Package, ChosenVersion # pylint: disable=import-outside-toplevel

        try:
            package = Package.objects.get(name=package_name, type=package_type)
        except ObjectDoesNotExist as _:
            package = Package.objects.create(
                name=package_name, type=package_type)
        try:
            version = ChosenVersion.objects.get(
                package=package, chosen_version=version)
            return version
        except ObjectDoesNotExist as _:
            version = ChosenVersion.objects.create(
                package=package, chosen_version=version)
            return version

    def add_repository(self, repository: dict):
        """
        Adds a new repository into the database if not set.

        :rtype: Repository
        """
        from .models import Repository # pylint: disable=import-outside-toplevel

        try:
            return Repository.objects.get(
                name=repository['name'],
                sources_lines=repository['lines']
            )
        except ObjectDoesNotExist:
            return Repository.objects.create(
                name=repository['name'],
                sources_lines=repository['lines']
            )

    def init_device(self, device_data: str):
        """ Finds the device linked to the snapshot currently being created.
        If set, returns it. Otherwise, creates a new one and returns it

        :type snapshot_raw_data: str
        :param snapshot_raw_data: Snapshot raw data send by the user (in JSON format)

        :rtype: Device
        """
        from .models import Device # pylint: disable=import-outside-toplevel
        try:
            self.send_message(
                status='info',
                message='Fetching the device...',
                type='message'
            )
            device_infos = {
                'name': device_data['hostname'],
                'cores': device_data['specs']['cores'],
                'memory': device_data['specs']['virtual_memory'],
                'processor': device_data['specs']['processor']
            }
            device = Device.objects.get(**device_infos)
            self.send_message(status='info',
                              type='message',
                              message='Device found!')
            return device
        except ObjectDoesNotExist as _:
            device = self.append_new_device(device_infos)
            self.send_message(status='info',
                              type='message',
                              message='No device found! Adding a new one!')
            return device

    def init_snapshot(self, snapshot_data: str, device):
        """ Creates a new snapshot object alongside the softwares

        :type device_data: str
        :param device_data: Raw snapshot data sent by the user

        :type device: Device
        :param device: Related device object

        :returns: Snapshot
        """
        from .models import Snapshot # pylint: disable=import-outside-toplevel
        snapshot = Snapshot.objects.create(
            related_device=device,
            save_date=timezone.now(),
            operating_system=snapshot_data['os']
        )
        for library_type in enumerate(snapshot_data['libraries']):
            library = snapshot_data['libraries'][library_type[1]]
            versions = self.append_libraries_chosen_version(
                library, library_type[1])
            for lib_version in versions:
                snapshot.versions.add(lib_version)
            snapshot.save()
        return snapshot

    def set_repositories(self, snapshot_data: str, snapshot):
        """ Add install types to the snapshot if set in the device raw data

        :type device_data: str
        :param device_data: Raw device snapshot data sent by the user

        :type snapshot: Snapshot
        :param snapshot: Created snapshot object in previous operation
        """
        try:
            self.send_message(status='info',
                              type='message',
                              message=f"Found {len(snapshot_data['repositories'])}")
            for _, repository in enumerate(snapshot_data['repositories']):
                repository = self.add_repository(repository)
                snapshot.repositories.add(repository)
        except KeyError as _:
            self.send_message(
                status='info',
                type='message',
                message='No repository found! Skipping the operation'
            )

    def receive(self, text_data=None, bytes_data=None):
        """ Receive data function from the client socket

        :type text_data: str
        :param text_data: JSON data sent by the client

        :type bytes_data: bytes
        :param bytes_data: Bytes sent by the client (Unused here)
        """
        snapshot_data = json.loads(text_data)
        device = self.init_device(snapshot_data)
        self.send_message(status='info', type='message',
                          message='Appending libraries to the database!')
        snapshot = self.init_snapshot(snapshot_data, device)
        self.set_repositories(snapshot_data, snapshot)
        self.send_message(status='info', type='end',
                          message='End of data added!')
        self.close(4004)
