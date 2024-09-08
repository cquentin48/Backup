import multiprocessing
import cpuinfo

import socket

import psutil


class BaseOS:
    """
    Base operating system mother class
    """

    cores = multiprocessing.cpu_count()
    """
    How many cores does the processor currently have
    """

    virtual_memory = psutil.virtual_memory().total
    """
    Virtual memory size (in bytes)
    """

    name = socket.gethostname()
    """
    Computer network name
    """

    processor = (
        cpuinfo.get_cpu_info()['brand']
        if 'brand' in cpuinfo.get_cpu_info()
        else cpuinfo.get_cpu_info()['brand_raw']
    )
    """
    Processor model
    """

    def __init__(self) -> None:
        raise NotImplementedError("You cannot implement a virtual class!")

    def to_dict(self) -> dict:
        """
        Generates a dictionnary for later usage in exporting to the server
        """
        metadata = {
            'hostname': self.name,
            'specs':
                {
                    'cores': self.cores,
                    'virtual_memory': self.virtual_memory,
                    'processor': self.processor
                }
        }

        return metadata
