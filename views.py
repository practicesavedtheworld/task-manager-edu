import aiohttp_jinja2
import asyncpg
from aiohttp.web import Request
from aiohttp import web
from aiohttp_session import get_session


@aiohttp_jinja2.template('index.html')
async def login(request: Request) -> dict:
    request.app['auth'] = False
    return {}

