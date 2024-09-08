import subprocess

from pandas.core.frame import DataFrame

from .packages import fetch_apt_packages, fetch_snap_packages
from operating_system.base_os import BaseOS


class Linux(BaseOS):
    """
    Linux OS backup operating system
    """

    def __init__(self) -> None:
        """
        Class initialisation
        """
        self.os = self.get_os_name()
        # TODO : includes others operating systems
        if 'Ubuntu' in self.os:
            self.apt = fetch_apt_packages()
            self.snap = fetch_snap_packages()

    def get_os_name(self):
        """
        Returns the operating system name
        """
        input = subprocess.Popen(
            ['lsb_release', '-d'],
            stdout=subprocess.PIPE
        )
        return ' '.join(input.stdout.read().decode('utf-8').replace('Description:	','').split(' ')[:2])

    def to_dict(self) -> dict:
        metadata = super().to_dict()
        metadata['os'] = self.os
        
        attributes = self.__dict__
        del attributes['os']
        
        metadata['libraries'] = {}
        for lib_type, library in attributes.items():
            if type(library) == DataFrame:
                metadata['libraries'][lib_type] = library.T.to_dict()
        
        return attributes