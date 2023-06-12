function customizeFormInput(input) {
    input.style.width = '90%';
    input.style.padding = '20px';
}

function customizeFormCloseButton(button) {
    button.classList.add('close');
    button.textContent = '×';
    button.style.position = 'absolute';

    button.style.top = '0';
    button.style.right = '0';
    button.style.margin = '10px';
}

function customizeModalElement(element) {
    element.style.position = 'absolute';
    element.style.borderRadius = '20px'

    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';

    element.style.width = '500px';
    element.style.height = '400px';

    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';
}

function createTimeout(seconds) {
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    // taskTableChildren[i].appendChild(timerElement);

    let remainingTime = seconds; // Turn hours to seconds
    let timerInterval = setInterval(() => {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Обновляем оставшееся время
        remainingTime--;

        // Если таймер закончился, очищаем интервал
        if (remainingTime < 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
    return timerElement
}


const addTaskForm = () => {
    // Creates modal form for task info when clicked add button
    const modal = document.createElement('div');
    modal.classList.add('modal');

    let htmlForm = document.createElement('form');
    htmlForm.method = 'post';
    htmlForm.action = '/add';

    //  Naming and styling input fields
    for (let i = 1; i < 5; i++) {
        const input = document.createElement('input');
        switch (i) {
            case 1:
                input.placeholder = 'Enter task name';
                input.name = 'task_name';
                break
            case 2:
                input.placeholder = 'Enter task category';
                input.name = 'category';
                break
            case 3:
                input.placeholder = 'Choose task timeout in hours';
                input.name = 'timeout';
                break
            case 4:
                input.placeholder = 'Set priority from 1 to 10 [1 - 10]';
                input.name = 'priority';
        }
        input.id = `input${i}`;
        customizeFormInput(input);
        htmlForm.append(input);
    }

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Send';
    submitButton.type = 'submit';
    htmlForm.append(submitButton);
    modal.append(htmlForm);

    const closeButton = document.createElement('button');
    closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        modal.style.display = 'none';
    });

    customizeFormCloseButton(closeButton);
    modal.append(closeButton);
    customizeModalElement(modal);
    document.body.append(modal);

    htmlForm.addEventListener('submit', (event) => {
        // event.preventDefault();

        const inputs = getFormValues(htmlForm);
        if (validateFormFields(inputs)) {

            let taskTable = document.getElementById('task_table');
            let tableRow = document.createElement('tr');

            let taskName = document.createElement('td');
            let taskCategory = document.createElement('td');
            let taskTimeout = document.createElement('td');
            let taskPriority = document.createElement('td');
            const f = new FormData(htmlForm);
            const ff = Object.fromEntries(f);
            fetch('/add', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ff)
            })
                .then(response => {
                    return response.json()
                })
                .catch(err => {
                    console.error(err)
                });
        }
    });


}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function getFormValues(form) {
    let inputs = {
        getHtmlForm() {
            return form;
        }
    };
    for (let i = 1; i < 5; i++) {
        const input = form.querySelector(`#input${i}`);
        let fieldName;
        switch (i) {
            case 1:
                fieldName = 'Task Name';
                break
            case 2:
                fieldName = 'Category';
                break
            case 3:
                fieldName = 'Timeout';

                break
            case 4:
                fieldName = 'Priority';
        }
        inputs[fieldName] = input.value;
    }

    return inputs;
}

function clearFormInputsById() {
    for (let i = 1; i < 5; i++) {
        const inputElement = document.getElementById(`input${i}`);
        inputElement.value = '';
    }
}

function validateFormFields(formObj) {
    const wrongInputContent = (input, placeholderText) => {
        input.classList.add('error');
        input.value = '';
        input.placeholder = placeholderText;
        input.style.backgroundColor = '#eea9a9';
        setTimeout(() => input.style.backgroundColor = '', 2500);
    }
    for (let key of Object.keys(formObj)) {
        switch (key) {
            case 'Timeout':
                const timeout = formObj['Timeout'];
                if (isNaN(timeout) || timeout < 0) {
                    const input = formObj.getHtmlForm().querySelector('#input3');
                    wrongInputContent(input, 'Timeout should be positive NUMBER or ZERO if no timeout is needed')
                    return false;
                }
                break
            case 'Priority':
                const priority = formObj['Priority'];
                if (priority > 10 || priority < 1 || isNaN(priority)) {
                    const input = formObj.getHtmlForm().querySelector('#input4');
                    wrongInputContent(input, 'Priority value should be NUMBER between 1 and 10');
                    return false;
                }
        }
    }

    return true;
}

function addTaskButtonHandler() {
    let add = document.querySelector('.task_content #task_operations #add_task');
    add.addEventListener('click', () => {
        addTaskForm();
    })
}

function removeTaskButtonHandler() {
    let remove = document.querySelector('.task_content #task_operations #remove_task');
    remove.addEventListener('click', () => {
        removeTasks();
    })
}

function editTaskButtonHandler() {
    let edit = document.querySelector('.task_content #task_operations #edit_task');
    edit.addEventListener('click', () => {
        editTask();
    })
}

const editTask = () => {
    const setWidth = (element) => element.style.width = '120px';

    function editForm() {
        const modalEdit = document.createElement('div');
        modalEdit.classList.add('modal');

        //  Create title
        const title = document.createElement('h2');
        title.textContent = 'Edit Current Task';
        modalEdit.appendChild(title);

        //  Create form
        const form = document.createElement('form');
        modalEdit.appendChild(form);

        //  Create field [Task name]
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Task Name';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameLabel.appendChild(nameInput);
        setWidth(nameLabel)
        form.appendChild(nameLabel);

        //  Create field [Task Category]
        const category = document.createElement('label');
        category.textContent = 'Category';
        const categoryInput = document.createElement('input');
        categoryInput.type = 'text';
        category.appendChild(categoryInput);
        setWidth(category)
        form.appendChild(category);

        //  Create field [Task Timeout]
        const timeout = document.createElement('label');
        timeout.textContent = 'Timeout';
        const timeoutInput = document.createElement('input');
        timeoutInput.type = 'text';
        timeout.appendChild(timeoutInput);
        setWidth(timeout)
        form.appendChild(timeout);

        // Create field [Task Priority]
        const priority = document.createElement('label');
        priority.textContent = 'Priority';
        const priorityInput = document.createElement('input');
        priorityInput.type = 'text';
        priority.appendChild(priorityInput);
        setWidth(priority);
        form.appendChild(priority);

        // Create field [Task status]
        const status = document.createElement('label');
        status.textContent = 'status';
        const statusInput = document.createElement('input');
        statusInput.type = 'text';
        status.appendChild(statusInput);
        setWidth(status);
        form.appendChild(status);


        // add form buttons
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';

        saveButton.addEventListener('click', () => {
            const validateEditFormField = (name, category, timeout, priority) => {
                return name.length > 0 && category.length > 0 && (!isNaN(timeout) && timeout >= 0) && priority > 0 && priority < 11;
            }
            const taskTableChildren = document.querySelector('#task_table').children;
            for (let i = taskTableChildren.length - 1; i > 0; i--) {
                if (taskTableChildren[i].classList.contains('selected')) {
                    // Values from form fields
                    const name = nameInput.value;
                    const category = categoryInput.value;
                    const timeout = timeoutInput.value;
                    const priority = priorityInput.value;
                    const status = statusInput.value;

                    // Get all cells of row
                    const taskCells = taskTableChildren[i].children;
                    if (!validateEditFormField(name, category, timeout, priority) && status.toLowerCase() !== 'done') {
                        modalEdit.remove();
                        break
                    } else if (status.toLowerCase() === 'done') {
                        // taskCells[0].style.backgroundColor = '#aeffd4';
                        //
                        for (let j = 0; j < taskCells.length; j++) {

                            for (let k = 0; k < taskCells.length; k++) {
                                taskTableChildren[i].className = '';
                                taskTableChildren[i].style.backgroundColor = '';
                                taskCells[k].style.backgroundColor = '#aeffd4';
                            }
                            if (j === 2) {
                                let timerValue = taskCells[j].textContent;
                                taskCells[j].textContent = timerValue.toString();
                            }
                        }
                        fetch('/edit_status', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/js'
                            },
                            body: JSON.stringify({
                                "task_name": taskCells[0].innerText,
                                "task_category": taskCells[1].innerText,
                                "task_priority": taskCells[3].innerText
                            })
                        })
                    } else {
                        if (validateEditFormField(name, category, timeout, priority)) {
                            fetch('/edit', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/js'
                                },
                                body: JSON.stringify({
                                    "prev_task": {
                                        "task_name": taskCells[0].innerText,
                                        "task_category": taskCells[1].innerText,
                                        "task_priority": taskCells[3].innerText
                                    },
                                    "task_name": name,
                                    "task_category": category,
                                    "task_timeout": timeout,
                                    "task_priority": priority
                                })
                            })
                        }
                        // Cells
                        taskCells[0].textContent = name;
                        taskCells[1].textContent = category;
                        taskCells[2].textContent = timeout;
                        taskCells[3].textContent = priority;
                        window.location.reload();
                    }

                }
            }
            modalEdit.remove();
        });

        cancelButton.addEventListener('click', () => {
            modalEdit.remove();
        });

        // Add buttons to the form.
        form.appendChild(saveButton);
        form.appendChild(cancelButton);
        customizeModalElement(modalEdit);

        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        document.body.appendChild(modalEdit);
    }

    editForm();
}

const removeTasks = () => {
    // Removing selected task[s].
    const taskTableChildren = document.querySelector('#task_table').children;
    const taskTable = document.querySelector('#task_table');
    let tasksToRemove = [];
    for (let i = taskTableChildren.length - 1; i > 0; i--) {
        if (taskTableChildren[i].classList.contains('selected')) {
            let trObj = {};
            let fieldName;
            for (let j = 0; j <= taskTableChildren[i].children.length - 1; j++) {
                switch (j) {
                    case 0:
                        fieldName = 'task_name';
                        break
                    case 1:
                        fieldName = 'task_category';
                        break
                    case 2:
                        continue
                    case 3:
                        fieldName = 'task_priority';
                }
                trObj[fieldName] = taskTableChildren[i].children[j].innerText;
            }
            tasksToRemove.push(trObj);
            taskTable.removeChild(taskTableChildren[i]);
        }
        // add del request
    }
    fetch('/remove', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tasksToRemove})
    })
}

function mouseMovementHandler(element, shadow) {
    element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = shadow;
        element.style.cursor = 'pointer';
    })

    element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = '';
        element.style.cursor = 'default';
    })

}

const taskSelectionHandler = () => {
    function sortBy(column) {
        // Sorting tasks by column that clicked by user
        let table = document.querySelector('#task_table');
        let name = column.textContent;
        let new_table = Array.from(table.rows).slice(1);

        switch (name) {
            case 'Priority':
                new_table.sort((a, b) => {
                    return parseInt(b.cells[3].textContent) - parseInt(a.cells[3].textContent);
                });
                break
            case 'Timeout':
                new_table.sort((a, b) => {
                    return parseInt(a.cells[2].textContent) - parseInt(b.cells[2].textContent);
                });
                break
            default:
                const idx = name === 'Category' ? 1 : 0;
                new_table.sort((a, b) => {
                    const aVal = a.cells[idx].textContent.toLowerCase();
                    const bVal = b.cells[idx].textContent.toLowerCase();
                    return aVal.localeCompare(bVal);
                });
        }

        for (let i = 0; i < new_table.length; i++) {
            table.appendChild(new_table[i]);
        }

    }

    let selectedTasks = new Set();
    const taskTable = document.querySelector('#task_table');
    taskTable.addEventListener('click', (event) => {
        const targetRow = event.target.closest('tr');
        const targetName = event.target;

        if (!targetRow || targetRow === taskTable.rows[0]) {
            sortBy(targetName);
            return
        }

        const taskId = targetRow.getAttribute('id');
        if (selectedTasks.has(taskId)) {
            selectedTasks.delete(taskId);
            targetRow.style.backgroundColor = '';
            targetRow.classList.remove('selected');
        } else {
            selectedTasks.add(taskId);
            targetRow.style.backgroundColor = '#bba3da';
            targetRow.classList.add('selected');
        }
    });
};


function myTasksButtonHandler() {
    // Shows all current task
    const myTasksButton = document.querySelector('.navigation [id=Mtask]');


    myTasksButton.addEventListener('click', event => {
        fetch('/my_tasks', {
            method: 'GET'
        }).then(resp => {
            window.location.reload();
        })
    })
    mouseMovementHandler(myTasksButton, 'gray');

}

function finishedTasksButtonHandler() {
    // Show tasks that have status 'done'
    const finishedTasksButton = document.querySelector('.navigation [id=CTask]');
    mouseMovementHandler(finishedTasksButton, 'gray');


    finishedTasksButton.addEventListener('click', event => {
        fetch('/finished_tasks', {
            method: 'GET'
        }).then(response => response.json())
            .then(data => {

                let taskTable = document.querySelector('#task_table');
                let taskTableChildren = taskTable.children;

                // Deletes all tr elementts except tbody
                for (let i = taskTableChildren.length - 1; i > 0; i--) {
                    let child = taskTableChildren[i];
                    taskTable.removeChild(child);
                }
                for (let obj of data) {
                    let tr = document.createElement('tr');
                    tr.style.backgroundColor = '#7fffd4';
                    for (let [key, value] of Object.entries(obj)) {
                        if (key !== 'status') {
                            let td = document.createElement('td');
                            if (key === 'end_time') {

                                const seconds = parseInt(value);
                                value = formatTime(seconds);

                            }
                            td.innerText = value;
                            tr.appendChild(td);
                        }
                    }
                    taskTable.appendChild(tr);
                }
            })
    })
}


function retiredTasksButtonHandler() {
    // Show tasks that was out of time
    const retiredTasksButton = document.querySelector('.navigation [id=Rtask]');
    mouseMovementHandler(retiredTasksButton, 'gray');
    retiredTasksButton.addEventListener('click', event => {
    })


}

async function menuHandler() {
    // Shading SVG elements and tbody on hover
    let images = document.querySelectorAll('img');
    for (let img of images) {
        mouseMovementHandler(img, '#849653');
    }

    let tbody = document.querySelector('tbody');
    let cells = tbody.querySelectorAll('td');
    cells.forEach(cell => {
        mouseMovementHandler(cell, 'gray')
    });


    const form = new FormData();
    const user = document.querySelector('#current_user').textContent.split(' - ')[1];
    form.append('current_user', user);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/tasks', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText); // Array[Obj...]
            let taskTable = document.querySelector('#task_table');

            for (let obj of data) {
                let tr = document.createElement('tr');
                let timerStr;  // Need to wait microseconds before timer is setting up. Can't get it in real-time

                for (let [k, v] of Object.entries(obj)) {
                    if (k !== 'status') {
                        let td = document.createElement('td');
                        if (k === 'end_time') {
                            timerStr = v;
                            const timerElement = createTimeout(parseInt(v));
                            td.appendChild(timerElement);
                        } else {
                            td.textContent = v;
                        }
                        tr.appendChild(td);
                    } else if (k === 'status' && v === 'done') {

                        tr.style.backgroundColor = '#7fffd4';

                        tr.children[2].textContent = timerStr ? formatTime(timerStr) : '';
                    }
                }
                taskTable.appendChild(tr);
            }
            // As soon as we in menu start all handlers
            addTaskButtonHandler();
            editTaskButtonHandler();
            taskSelectionHandler();
            removeTaskButtonHandler();
            myTasksButtonHandler();
            finishedTasksButtonHandler();
            retiredTasksButtonHandler();
        }
    };
    xhr.send(form);
}

menuHandler()

