from pathlib import Path
from aiohttp import web


def setup_routes(app: web.Application):
    router = app.router
    router.add_static('/js', Path(__file__).parent / 'js', name='js')
    router.add_static('/static', Path(__file__).parent / 'static', name='static')
