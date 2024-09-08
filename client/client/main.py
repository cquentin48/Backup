import platform
import socket

from operating_system.linux.operating_system import Linux

def connect():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect(("channels",6379))
        client.send(b"Hello world!")

def main():
    os_type = platform.system()
    if os_type == 'Linux':
        data = Linux()
        output = data.to_dict()
        print(output.keys())
        connect()


if __name__ == '__main__':
    main()