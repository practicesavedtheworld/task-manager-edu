from yaml import safe_load
import pathlib

CONFIG_PATH = pathlib.Path(__file__).parent / 'config' / 'configuration.yaml'


def load_config():
    with open(CONFIG_PATH, encoding='UTF-8') as config_file:
        config = safe_load(config_file)
    return config
