FROM python:3.9

COPY . .


RUN pip install --no-cache-dir -r requirements.txt


RUN apt-get update && apt-get install -y postgresql-client
RUN psql -U postgres -h localhost -c "CREATE DATABASE tmusers"

CMD python3 main.py
