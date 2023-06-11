from aiohttp import web
import asyncpg


async def setup_db(app: web.Application) -> None:
    """Create 2 tables bound with user_id"""

    db_config = app['config']['postgres']
    try:
        pool: asyncpg.Pool = await asyncpg.create_pool(**db_config)
        async with pool.acquire() as connection:
            try:
                async with connection.transaction():
                    users_table_create_query = """
                           CREATE TABLE IF NOT EXISTS users(
                           user_id BIGSERIAL PRIMARY KEY,
                           user_name VARCHAR(50),
                           user_password VARCHAR(100));"""
                    current_tasks_table_create_query = """
                       CREATE TABLE IF NOT EXISTS current_tasks(
                       user_id BIGINT,
                       task_id BIGSERIAL PRIMARY KEY,
                       start_time VARCHAR(70),
                       end_time VARCHAR(70),
                       task_name VARCHAR(100),
                       task_category VARCHAR(60),
                       task_priority VARCHAR(3),
                       status VARCHAR(15));"""
                    for query in users_table_create_query, current_tasks_table_create_query:
                        await connection.execute(query)
                    app['db'] = pool
            except asyncpg.InvalidTransactionStateError:
                raise
    except asyncpg.PostgresError as err:
        raise err
