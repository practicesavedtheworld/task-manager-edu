# task-manager-edu
Simple web task manager. AIOHTTP + JS

&#9888;This was created for educational purposes only, to better understand the interaction of AIOHTTP with JavaScript

## Requirements
ECMAScript 2017 (ES8)+

Python 3.7+

## Quick DEMO


https://github.com/practicesavedtheworld/task-manager-edu/assets/105741091/661adb7a-f2be-4fd1-9117-07d9d7691db6



##  INFO

I chose simple relation between user and his tasks using postgreSQL.

![database_taskmanager](https://github.com/practicesavedtheworld/task-manager-edu/assets/105741091/7cea0fac-97d2-4053-ad1e-aec4daaac6a2)

Task manager has 3 buttons for showing current tasks, retired tasks and completed tasks. Also it has buttons for add, remove, edit tasks.

Each tasks contained in table which supports sorting by column clicked 
![tm](https://github.com/practicesavedtheworld/task-manager-edu/assets/105741091/17697c50-f8a3-427a-bd85-dfd51d10bd9c)


## USAGE

### Create database

<pre><code>$ psql -U postgres -h localhost
> CREATE DATABASE tmusers;</code></pre>

### Using


<pre><code>$ git clone https://github.com/practicesavedtheworld/task-manager-edu

$ cd task-manager-edu

$ pip install -r requirements.txt

$ python3 main.py</code></pre>

Open http://0.0.0.0:8080 in browser (Make sure your port 8888 is open)
Use it
