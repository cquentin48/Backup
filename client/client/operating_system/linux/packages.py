import subprocess
import pandas as pd

def fetch_snap_packages() -> dict:
    """
    From the snap package
    
    :raises FileNotFoundError: If snap package hasn't been added
    """
    try:
        input = subprocess.Popen(
            [
                'snap',
                'list'
            ],
            stdout=subprocess.PIPE
        )
        results = input.stdout.read().decode('utf-8')
        lines = []
        for result in results.split('\n'):
            line_data = [input for input in result.split(' ') if input != '']
            lines.append(line_data)
        
        column_headers = lines[0]
        data = lines[1:]
        return pd.DataFrame(data=data, columns=column_headers)
    except FileNotFoundError as shell_exec_error:
        raise subprocess.CalledProcessError("You do not have snap installed!")\
        from shell_exec_error

def fetch_apt_packages() -> dict:
    """ Generates a dictionnary containing
    every packages with the following elements:
    * Package name
    * Package version
    * Package source
    * Package type
    """
    
    input = subprocess.Popen([
        'dpkg-query',
        "--showformat='${Package};${Version};${Source}\n'",
        '--show'],
        stdout=subprocess.PIPE)
    result = input.stdout.read().decode('utf-8')
    lines = [line.replace("'","") for line in result.split('\n') if line != "'"]
    rows = {
        'Package':[],
        'Version':[],
        'Source':[],
    }
    for key, data in enumerate(rows):
        for line in lines:
            try:
                package_data = line.split(';')
                rows[data].append(package_data[key])
            except IndexError as e:
                print(data)
                print(key)
                print(rows)
                raise e
    packages_data = pd.DataFrame(rows)
    return packages_data

fetch_snap_packages()