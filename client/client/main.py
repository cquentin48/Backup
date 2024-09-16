import platform

import json

from tqdm import tqdm

from websocket import create_connection
from websocket._core import WebSocket
from websocket._exceptions import WebSocketAddressException, WebSocketConnectionClosedException

from operating_system.linux.operating_system import Linux


def connect_to_server(address: str, port: int) -> WebSocket:
    """ 
    Creates a connection to the server and returns the client socket
    :type address: str
    :param address: IP Adress of the server

    :type port: int
    :param port: Port of the remote device containing the server

    :raises:
        WebSocketAddressException : The server ip address and/or the port is invalid

    :rtype:
        WebSocket
    """
    try:
        ws = create_connection(f"ws://{address}:{str(port)}/backup/import")
        _ = ws.recv()
        print("Connected to the server.")
        return ws
    except WebSocketAddressException as error:
        print("The server is not loaded!")
        raise error


def progress_bar_managment(data: dict, progress_bar: tqdm):
    """ Manages progress bar
    :type data: dict
    :param data: Progress data (stored in a dictionnary)

    :type progress_bar: tqdm
    :param progress_bar: Progress bar object
    """
    progress_bar_info = data['infos']
    progress_bar_info = json.loads(progress_bar_info)
    progress_bar = tqdm(position=0, leave=True)
    total = 0
    match progress_bar_info['state']:
        case 'init':
            progress_bar.total = progress_bar_info['total']
            progress_bar.desc = progress_bar_info['desc']
            progress_bar.reset()
        case 'update':
            progress_bar.update()
            if progress_bar_info['index'] == total:
                progress_bar.stop()


def send_data(data: dict, backup_client: WebSocket):
    """ Sends data to the server

    :type data: dict
    :param data: Data to send

    :type backup_client: WebSocket
    :param backup_client: Backup socket client which manages send and receiving data
    """
    backup_client.send(json.dumps(data))
    msg = backup_client.recv()
    progress_bar = None
    msg_data = json.loads(msg)
    try:
        while 'type' in msg_data and msg_data['type'] != 'end':
            if not backup_client.connected:
                print("Connection lost with the server. Exiting client")
            msg = backup_client.recv()
            while not msg:
                msg = backup_client.recv()
            msg_data = json.loads(msg)
            match msg_data['type']:
                case 'message':
                    # Todo : change colors based on the result (red -> error ; yellow -> warning ; green : success ; white : information)
                    print(msg_data['message'])
                case 'progress_bar':
                    progress_bar_managment(msg_data, progress_bar)
                case 'end':
                    print(msg_data['message'])
                    backup_client.close()
    except WebSocketConnectionClosedException as e:
        print("Connection closed!")
        raise e

    except json.decoder.JSONDecodeError as e:
        print("Error while decoding messages from the server")
        raise e


def main():
    os_type = platform.system()
    if os_type == 'Linux':
        print("Linux OS detected!")
        data = Linux()
        output = data.to_dict()
        print(f"Connecting to the backup server")
        socket_client = connect_to_server("0.0.0.0", 8000)
        print(f"Sending data to {output['os']}")
        send_data(output, socket_client)


if __name__ == '__main__':
    main()
