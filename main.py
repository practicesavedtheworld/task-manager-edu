import asyncio

from aiohttp import web
from aiohttp_session import setup
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet
from settings import load_config
from db import setup_db
from template import setup_jinja
from routes import setup_routes


def main():
    app = web.Application()
    setup(app, EncryptedCookieStorage(fernet.Fernet.generate_key()[:32]))

    setup_jinja(app=app)
    config = load_config()
    app['config'] = config
    setup_routes(app=app)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(setup_db(app=app))
    web.run_app(app=app, loop=loop, port=8888)


if __name__ == '__main__':
    main()
