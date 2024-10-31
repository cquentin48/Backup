import json

from typing import Tuple

from channels.testing import WebsocketCommunicator

from django.test import SimpleTestCase

import pytest

from data.consumers import BackupImportConsumer
from data.models import Device, Package, ChosenVersion, Repository, Save


class TestConsumers(SimpleTestCase):
    """
    Websocket unit test class
    """

    databases = '__all__'

    def tearDown(self):
        Save.objects.all().delete()
        Device.objects.all().delete()
        ChosenVersion.objects.all().delete()
        Package.objects.all().delete()
        Repository.objects.all().delete()

        return super().tearDown()

    async def init_ws_communication(self) -> Tuple[bool, WebsocketCommunicator]:
        """ Construct a web socket client for unit test. Returns with it the status of communication

        :rtype: (bool, WebsocketCommunicator)
        """
        communicator = WebsocketCommunicator(
            BackupImportConsumer.as_asgi(),
            "/backup/import"
        )
        connected, _ = await communicator.connect()

        return connected, communicator

    def test_append_new_device(self):
        """
        Check if the websocket creates a new device if not already set.
        """
        # Given
        name = "My device!"
        processor = "My processor"
        cores = 8
        memory = 32
        operating_system = "Test OS"

        device_infos = {
            'name': name,
            'processor': processor,
            'cores': cores,
            'memory': memory,
            'operating_system': operating_system
        }

        test_object = BackupImportConsumer()

        # Acts
        op_result = test_object.append_new_device(device_infos)
        expected_op_result = list(Device.objects.all())[0]

        # Asserts
        self.assertEqual(op_result, expected_op_result)

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_connect(self):
        """
        Check if a websocket client can connect to the server.
        """
        # Acts
        op_result, communicator = await self.init_ws_communication()

        # Asserts
        expected_op_result = True
        self.assertEqual(op_result, expected_op_result)

        # After test
        await communicator.disconnect()

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_connect_expect_msg(self):
        """
        Check if a websocket client can connect and receive the message "Connected!".
        """
        # Acts
        _, communicator = await self.init_ws_communication()
        received_msg = await communicator.receive_from()

        # Asserts
        expected_received_msg = "Connected!"
        self.assertEqual(received_msg, expected_received_msg)

        # After test
        await communicator.disconnect()

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_transmit_data_no_repository_already_set_version(self):
        """
        Check if the transmission of a simple data is successful (no repository set)
        """
        # Given
        sample_data = {
            "hostname": "my-computer",
            "specs": {
                "cores": 1,
                "virtual_memory": 16,
                "processor": "My processor"
            },
            "os": "My OS",
            "libraries": {
                "first_type": {
                    "0": {
                        "Package": "my_package",
                        "Version": "1.0",
                        "Repository": "my_repo"
                    },
                    "1": {
                        "Package": "my_package",
                        "Version": "1.0",
                        "Repository": "my_repo"
                    }
                }
            }
        }

        _, communicator = await self.init_ws_communication()

        # Acts
        await communicator.send_to(text_data=json.dumps(sample_data))

        responses = []
        response = await communicator.receive_from()
        while isinstance(response, str) or response['type'] != 'end':
            responses.append(response)
            response = json.loads(await communicator.receive_from())
        responses.append(response)

        # Assert
        self.assertEqual(responses[0], 'Connected!')

        stringified_msgs = []

        for msg in responses[1:]:
            stringified_msgs.append(json.dumps(msg))
            self.assertTrue(isinstance(msg, dict))

        self.assertTrue(stringified_msgs[0],
                        '{"status": "info", "message": "Fetching the device...",'+
                        ' "type": "message"}')
        self.assertTrue(stringified_msgs[1],
                        '{"status": "info", "type": "message", "message": ' +
                        '"No device found! Adding a new one!"}')
        self.assertTrue(stringified_msgs[2],
                        '{"status": "info", "type": "message", ' +
                        '"message": "Appending libraries to the database!"}'
                        )
        self.assertTrue(stringified_msgs[3],
                        '{"status": "info", "type": "progress_bar", "infos": ' +
                        '"{\"state\": \"init\", \"total\": 1, \"desc\": ' +
                        '\"first_type packages import\"}"}')
        self.assertTrue(stringified_msgs[4],
                        '{"status": "info", "type": "progress_bar", ' +
                        '"infos": "{\"state\": \"update\", \"index\": \"0\"}"}'
                        )
        self.assertTrue(stringified_msgs[5],
                        '{"status": "info", "type": "message", ' +
                        '"message": "No repository found! Skipping the operation"}')
        self.assertTrue(stringified_msgs[6],
                        '{"status": "info", "type": "end", "message": "End of data added!"}'
                        )

        await communicator.disconnect()

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_transmit_data_no_repository_already_set_device(self):
        """
        Check if the transmission of a simple data is successful (no repository set)
        """
        # Given
        sample_data = {
            "hostname": "my-computer",
            "specs": {
                "cores": 1,
                "virtual_memory": 16,
                "processor": "My processor"
            },
            "os": "My OS",
            "libraries": {
                "first_type": {
                    "0": {
                        "Package": "my_package",
                        "Version": "1.0",
                        "Repository": "my_repo"
                    }
                }
            }
        }

        _, communicator = await self.init_ws_communication()

        # Acts
        await communicator.send_to(text_data=json.dumps(sample_data))

        responses = []
        response = await communicator.receive_from()
        while isinstance(response, str) or response['type'] != 'end':
            responses.append(response)
            response = json.loads(await communicator.receive_from())
        responses.append(response)

        _, communicator = await self.init_ws_communication()
        await communicator.send_to(text_data=json.dumps(sample_data))

        responses = []
        response = await communicator.receive_from()
        while isinstance(response, str) or response['type'] != 'end':
            responses.append(response)
            response = json.loads(await communicator.receive_from())
        responses.append(response)

        expected_element = {
            'status': 'info',
            'type': 'message',
            'message': 'Device found!'
        }

        # Assert
        self.assertTrue(expected_element in responses)

        await communicator.disconnect()

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_transmit_data_no_repository(self):
        """
        Check if the transmission of a simple data is successful (no repository set)
        """
        # Given
        sample_data = {
            "hostname": "my-computer",
            "specs": {
                "cores": 1,
                "virtual_memory": 16,
                "processor": "My processor"
            },
            "os": "My OS",
            "libraries": {
                "first_type": {
                    "0": {
                        "Package": "my_package",
                        "Version": "1.0",
                        "Repository": "my_repo"
                    }
                }
            }
        }

        _, communicator = await self.init_ws_communication()

        # Acts
        await communicator.send_to(text_data=json.dumps(sample_data))

        responses = []
        response = await communicator.receive_from()
        while isinstance(response, str) or response['type'] != 'end':
            responses.append(response)
            response = json.loads(await communicator.receive_from())
        responses.append(response)

        # Assert
        self.assertEqual(responses[0], 'Connected!')

        stringified_msgs = []

        for msg in responses[1:]:
            stringified_msgs.append(json.dumps(msg))
            self.assertTrue(isinstance(msg, dict))

        self.assertTrue(stringified_msgs[0],
                        '{"status": "info", "message": "Fetching the device...", '+
                        '"type": "message"}')
        self.assertTrue(stringified_msgs[1],
                        '{"status": "info", "type": "message", "message": ' +
                        '"No device found! Adding a new one!"}')
        self.assertTrue(stringified_msgs[2],
                        '{"status": "info", "type": "message", ' +
                        '"message": "Appending libraries to the database!"}'
                        )
        self.assertTrue(stringified_msgs[3],
                        '{"status": "info", "type": "progress_bar", "infos": ' +
                        '"{\"state\": \"init\", \"total\": 1, \"desc\": ' +
                        '\"first_type packages import\"}"}')
        self.assertTrue(stringified_msgs[4],
                        '{"status": "info", "type": "progress_bar", ' +
                        '"infos": "{\"state\": \"update\", \"index\": \"0\"}"}'
                        )
        self.assertTrue(stringified_msgs[5],
                        '{"status": "info", "type": "message", ' +
                        '"message": "No repository found! Skipping the operation"}')
        self.assertTrue(stringified_msgs[6],
                        '{"status": "info", "type": "end", "message": "End of data added!"}'
                        )

        await communicator.disconnect()

    @pytest.mark.django_db(transaction=True)
    @pytest.mark.asyncio
    async def test_transmit_data_repository(self):
        """
        Check if the transmission of a simple data is successfull
        """
        # Given
        sample_data = {
            "hostname": "my-computer",
            "specs": {
                "cores": 1,
                "virtual_memory": 16,
                "processor": "My processor"
            },
            "os": "My OS",
            "libraries": {
                "first_type": {
                    "0": {
                        "Package": "my_package",
                        "Version": "1.0",
                        "Repository": "my_repo"
                    }
                }
            },
            "repositories": [
                {
                    'name': 'My repo name!',
                    'lines': ''
                }
            ]
        }

        _, communicator = await self.init_ws_communication()

        # Acts
        await communicator.send_to(text_data=json.dumps(sample_data))

        responses = []
        response = await communicator.receive_from()
        while isinstance(response, str) or response['type'] != 'end':
            responses.append(response)
            response = json.loads(await communicator.receive_from())
        responses.append(response)

        # Assert
        self.assertEqual(responses[0], 'Connected!')

        stringified_msgs = []

        for msg in responses[1:]:
            stringified_msgs.append(json.dumps(msg))
            self.assertTrue(isinstance(msg, dict))

        self.assertTrue(stringified_msgs[0],
                        '{"status": "info", "message": "Fetching the device...", '+
                        '"type": "message"}')
        self.assertTrue(stringified_msgs[1],
                        '{"status": "info", "type": "message", "message": ' +
                        '"No device found! Adding a new one!"}')
        self.assertTrue(stringified_msgs[2],
                        '{"status": "info", "type": "message", ' +
                        '"message": "Appending libraries to the database!"}'
                        )
        self.assertTrue(stringified_msgs[3],
                        '{"status": "info", "type": "progress_bar", "infos": ' +
                        '"{\"state\": \"init\", \"total\": 1, \"desc\": ' +
                        '\"first_type packages import\"}"}')
        self.assertTrue(stringified_msgs[4],
                        '{"status": "info", "type": "progress_bar", ' +
                        '"infos": "{\"state\": \"update\", \"index\": \"0\"}"}'
                        )
        self.assertTrue(stringified_msgs[5],
                        '{"status": "info", "type": "message", ' +
                        '"message": "No repository found! Skipping the operation"}')
        self.assertTrue(stringified_msgs[6],
                        '{"status": "info", "type": "end", "message": "End of data added!"}'
                        )

        await communicator.disconnect()
