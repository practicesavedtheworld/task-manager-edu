import asyncio

from aiohttp import web
from aiohttp_session import setup
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet


def main():
    app = web.Application()
    setup(app, EncryptedCookieStorage(fernet.Fernet.generate_key()[32:]))
    loop = asyncio.get_event_loop()
    web.run_app(app=app, loop=loop, port=8888)


if __name__ == '__main__':
    main()
