import aiohttp_jinja2
import jinja2
import pathlib
from aiohttp import web

T_PATH = pathlib.Path(__file__).parent / 'templates'


def setup_jinja(app: web.Application) -> None:
    loader = jinja2.FileSystemLoader(T_PATH)
    aiohttp_jinja2.setup(app, loader=loader)