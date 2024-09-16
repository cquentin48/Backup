from typing import Literal

from channels.generic.websocket import WebsocketConsumer

from django.core.exceptions import ObjectDoesNotExist

import json

from .models import Device, Package, ChosenVersion


class BackupImportConsumer(WebsocketConsumer):
    def connect(self):
        """ Connect the client to the database.
        Check if user is connected before.
        """
        # TODO: check if the user has a valid token
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
        return Device.objects.create(
            **device_infos
        )

    def append_library_packages(self, packages: dict, library_name: str, device: Device):
        infos = {
            'state': 'init',
            'total': len(packages),
            'desc': f'{library_name} packages import'
        }
        self.send_message(status='info', type='progress_bar',
                          infos=json.dumps(infos))
        for package_index in packages:
            try:
                data = packages[package_index]
                self.append_library(
                    data['Package'], data['Version'], library_name, device)
                self.send_message(
                    status='info',
                    type='progress_bar',
                    infos=json.dumps({'state': 'update', 'index': package_index})
                )
            except KeyError as e:
                with open('file','w') as file:
                    file.write(str(list(data.keys())))
                raise e

    def append_library(self, package_name: str, version: str, package_type: str, device: Device):
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
        try:
            package = Package.objects.get(name=package_name, type=package_type)
        except ObjectDoesNotExist as _:
            package = Package.objects.create(
                name=package_name, type=package_type)
        try:
            version = ChosenVersion.objects.get(
                package=package, device=device, chosen_version=version)
        except ObjectDoesNotExist as _:
            version = ChosenVersion.objects.create(
                package=package, device=device, chosen_version=version)

    def receive(self, text_data=None, bytes_data=None):
        """ Receive data function from the client socket

        :type text_data: str
        :param text_data: JSON data sent by the client

        :type bytes_data: bytes
        :param bytes_data: Unused here
        """
        try:
            self.send_message(
                status='info',
                message='Fetching the device...',
                type='message'
            )
            device_data = json.loads(text_data)
            device_infos = {
                'name': device_data['hostname'],
                'cores': device_data['specs']['cores'],
                'memory': device_data['specs']['virtual_memory'],
                'processor': device_data['specs']['processor'],
                'operating_system': device_data['os']
            }
            device = Device.objects.get(**device_infos)
            self.send_message(status='info',
                              type='message',
                              message='Device found!')
        except ObjectDoesNotExist as _:
            device = self.append_new_device(device_infos)
            self.send_message(status='info',
                              type='message',
                              message='No device found! Adding a new one!')
        finally:
            self.send_message(status='info', type='message',
                              message='Appending libraries to the database!')
            for library_type in enumerate(device_data['libraries']):
                library = device_data['libraries'][library_type[1]]
                self.append_library_packages(library, library_type[1], device)
            self.send_message(status='info', type='end',
                              message='End of data added!')
            self.close(4004)
