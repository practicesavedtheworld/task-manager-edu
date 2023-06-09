from typing import Optional
from datetime import datetime, timedelta

import aiohttp_jinja2
import asyncpg
from aiohttp.web import Request, Response
from aiohttp import web
from aiohttp_session import get_session, Session


@aiohttp_jinja2.template('index.html')
async def login(request: Request) -> dict:
    return {}


async def my_tasks(request: Request) -> Response:
    return web.HTTPFound(location='/menu')


async def add_task(request: Request) -> Optional[Response]:
    """Receives a form from the client and puts it into the database"""

    data = await request.post()
    name, category, timeout, priority = [data.get(row) for row in data.keys()]
    db: asyncpg.Pool = request.app['db']
    async with db.acquire() as connection:
        async with connection.transaction():
            session = await get_session(request)
            user_name = session['user_name']
            if user_name is None:
                return web.HTTPNotFound()
            user_id_query = "SELECT user_id FROM users WHERE user_name = $1;"
            user_id = await connection.fetchval(user_id_query, user_name)
            push_query = """
            INSERT INTO current_tasks(user_id, task_name, task_category, start_time, end_time, task_priority)
            VALUES ($1, $2, $3, $4, $5, $6)"""
            start_time = datetime.now()
            preend_time = start_time + timedelta(hours=int(timeout))
            end_time: float = (preend_time - start_time).total_seconds()
            await connection.fetchrow(push_query, user_id, name, category, str(start_time.time()),
                                      str(end_time), priority)
    raise web.HTTPFound(location='/menu')


async def edit_status(request: Request) -> Response:
    """Receive task info and change status in DB into 'done'. It means task had been finished."""

    data = await request.json()
    name, category, priority = [data.get(row) for row in data.keys()]
    db: asyncpg.Pool = request.app['db']
    async with db.acquire() as connection:
        async with connection.transaction():
            session = await get_session(request)
            user_name = session['user_name']
            user_id_query = "SELECT user_id FROM users WHERE user_name = $1;"
            user_id = await connection.fetchval(user_id_query, user_name)
            put_query = """
                        UPDATE current_tasks
                        SET status = $5
                        WHERE task_name = $1 AND task_category = $2 AND task_priority = $3 AND user_id = $4;"""
            await connection.execute(put_query, name, category, priority, user_id, 'done')

    return web.Response()


async def edit(request: Request) -> Response:
    """Receive info about task if task status is not 'done'. Rewrites task fields based on users desire."""

    data = await request.json()
    previous_task, name, category, timeout, priority = [data.get(row) for row in data.keys()]
    db: asyncpg.Pool = request.app['db']
    async with db.acquire() as connection:
        async with connection.transaction():
            session = await get_session(request)
            user_name = session['user_name']
            pr_name, pr_category, pr_priority = [previous_task.get(key) for key in previous_task.keys()]
            user_id_query = "SELECT user_id FROM users WHERE user_name = $1;"
            user_id = await connection.fetchval(user_id_query, user_name)
            put_query = """
                            UPDATE current_tasks
                            SET task_name = $5, task_category = $6, start_time = $9, end_time = $7, task_priority = $8
                            WHERE task_name = $1 AND task_category = $2 AND task_priority = $3 AND user_id = $4;"""
            start = datetime.now()
            preend = start + timedelta(hours=int(timeout))
            end = (preend - start).total_seconds()
            await connection.execute(
                put_query, pr_name, pr_category,
                pr_priority, user_id, name,
                category, str(end), priority, str(start.time()),
            )
    return web.Response()


async def remove_task(request: Request) -> Response:
    """Delete task selected by user from DB"""

    data = await request.json()
    session = await get_session(request)
    user_name = session['user_name']

    pool: asyncpg.Pool = request.app['db']
    async with pool.acquire() as connection:
        async with connection.transaction():
            user_id_query = "SELECT user_id FROM users WHERE user_name = $1;"
            user_id = await connection.fetchval(user_id_query, user_name)
            delete_query = """
            DELETE FROM current_tasks
            WHERE user_id = $1 AND task_name = $2 AND task_category = $3 AND task_priority = $4;"""
            for task_json in data['tasksToRemove']:
                name, category, priority = [task_json.get(row) for row in task_json.keys()]
                await connection.execute(delete_query, user_id, name, category, priority)
            return web.Response()


async def user_tasks(request: Request) -> Response:
    """Depend on method returns all current tasks or completed tasks.
    GET returns completed, POST return all tasks."""

    method = request.method
    session = await get_session(request)
    user = session.get('user_name')

    pool = request.app['db']
    async with pool.acquire() as connection:
        async with connection.transaction():
            if method == 'POST':
                tasks_query: asyncpg.Record = """
                SELECT current_tasks.task_name, current_tasks.task_category, current_tasks.end_time, current_tasks.task_priority, current_tasks.status
                FROM current_tasks
                JOIN users ON users.user_id = current_tasks.user_id
                WHERE users.user_name = $1;
            """
                tasks = await connection.fetch(tasks_query, user)

            elif method == 'GET':
                fin_tasks_query = """
                SELECT current_tasks.task_name, current_tasks.task_category, current_tasks.end_time, current_tasks.task_priority, current_tasks.status
                FROM current_tasks
                JOIN users ON users.user_id = current_tasks.user_id
                WHERE users.user_name = $1 AND current_tasks.status = $2;"""
                tasks = await connection.fetch(fin_tasks_query, user, 'done')
            tasks_json = [{k: v for k, v in t.items()} for t in tasks]

    return web.json_response(tasks_json)


async def new_user(request: Request) -> Optional[Response]:
    """User registration process"""

    data = await request.post()
    user_login, password = data.get('login'), data.get('password')
    pool: asyncpg.Pool = request.app['db']
    async with pool.acquire() as connection:
        async with connection.transaction():
            is_user_in_db_query = """SELECT user_name FROM users WHERE user_name = $1;"""
            is_user_in_db = await connection.fetch(is_user_in_db_query, user_login)
            if is_user_in_db:
                return web.json_response({'status': False})
            add_user_query = """INSERT INTO users (user_name, user_password) VALUES ($1, $2)"""
            await connection.fetch(add_user_query, user_login, password)
            current_user_query = """SELECT user_name FROM users WHERE user_name = $1 AND user_password = $2;"""
            record = await connection.fetchrow(current_user_query, user_login, password)
            if record:
                user_name = record['user_name']
                session = await get_session(request)
                session['user_name'] = user_name

    raise web.HTTPFound(location='/')


@aiohttp_jinja2.template('menu.html')
async def menu(request: Request) -> dict[str, Session]:
    """Create session for every user"""

    session = await get_session(request)
    return {'user': session['user_name']}


async def go(request: Request) -> Optional[Response]:
    """Validate user info and redirect into main menu"""

    data = await request.post()
    user_login, password = data.get('login'), data.get('password')
    pool: asyncpg.Pool = request.app['db']
    async with pool.acquire() as connection:
        async with connection.transaction():
            current_tasks_query = """
            SELECT user_name, user_password 
            FROM users
            WHERE user_name = $1 AND user_password = $2;"""
            record = await connection.fetch(current_tasks_query, user_login, password)
            if record:
                session = await get_session(request)
                session['user_name'] = record[0]['user_name']
                return web.HTTPFound(location='/menu')
            raise web.HTTPNotFound()
