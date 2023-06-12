import pathlib

from aiohttp import web

from views import login, go, menu, add_task, new_user, user_tasks, remove_task, edit, edit_status, my_tasks


def setup_routes(app: web.Application):
    router = app.router
    router.add_get('/', login)
    router.add_post('/new_user', new_user)

    router.add_get('/menu', menu)
    router.add_post('/go', go)
    router.add_get('/my_tasks', my_tasks)
    router.add_get('/finished_tasks', user_tasks)
    router.add_post('/tasks', user_tasks)
    router.add_post('/add', add_task)
    router.add_put('/edit_status', edit_status)
    router.add_put('/edit', edit)
    router.add_delete('/remove', remove_task)

    router.add_static('/js', pathlib.Path(__file__).parent / 'js', name='js')
    router.add_static('/static', pathlib.Path(__file__).parent / 'static', name='static')
