from glob import glob
import subprocess
import pandas as pd


def fetch_snap_packages() -> dict:
    """
    From the snap package

    :raises FileNotFoundError: If snap package hasn't been added
    """
    try:
        print("Snap package system detected!")
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
        raw_df = pd.DataFrame(data=data, columns=column_headers).agg(lambda x: x.dropna())
        new_df = pd.DataFrame()
        new_df['Package'] = raw_df['Name']
        new_df['Version'] = raw_df['Version']
        new_df['Repository'] = 'snap'
        
        return new_df
    except FileNotFoundError as shell_exec_error:
        raise subprocess.CalledProcessError("You do not have snap installed!")\
            from shell_exec_error


def fetch_repositories() -> str:
    """ Fetch for each package the related repository
    :type package_row: str
    :param package_row: Package name

    :rtype:
        str
    """
    repositories_list = glob('/var/lib/apt/lists/*Release')
    repositories = {}
    for repository in repositories_list:
        with open(repository) as file:
            lines = file.readlines()
            ubuntu_default_package = (False
                                      if len(
                                          [
                                              line for line in lines
                                              if 'Origin: Ubuntu' in line
                                          ]) == 0
                                      else True)
            name = [
                line.replace('Origin: ', '').replace('\n', '')
                for line in lines
                if 'Origin:' in line and 'Origin: Ubuntu' not in line
            ]
            if len(name) > 0:
                name = name[0]
            else:
                ubuntu_default_package = True
        if not ubuntu_default_package:
            file_name = repository.replace('_InRelease', '')
            if len(glob(f'{file_name}*Packages')) > 0:
                package_list_repo_filepath = glob(f'{file_name}*Packages')[0]
                with open(package_list_repo_filepath) as file:
                    lines = file.readlines()
                    packages = [line.replace('Package: ', '').replace('\n', '')
                                for line in lines if 'Package:' in line]
                    repositories[name] = list(set(packages))

    return repositories


def fetch_apt_packages() -> dict:
    """ Generates a dictionnary containing
    every packages with the following elements:
    * Package name
    * Package version
    * Package source
    * Package type
    """
    print("APT packages system detected!")
    input = subprocess.Popen([
        'dpkg-query',
        "--showformat='${Package};${Version};${Source}\n'",
        '--show'],
        stdout=subprocess.PIPE)
    result = input.stdout.read().decode('utf-8')
    lines = [line.replace("'", "")
             for line in result.split('\n') if line != "'"]
    rows = {
        'Package': [],
        'Version': []
    }
    for key, data in enumerate(rows):
        for line in lines:
            try:
                package_data = line.split(';')
                rows[data].append(package_data[key])
            except IndexError as e:
                raise e
    rows['Repository'] = []
    repositories = fetch_repositories()
    for package_name in rows['Package']:
        repository_name = [repository for repository in repositories if package_name in repository]
        if len(repository_name) > 0:
            repository_name = repository_name[0]
        else:
            repository_name = 'Ubuntu'
        rows['Repository'].append(repository_name)
    packages_data = pd.DataFrame(rows)
    return packages_data
