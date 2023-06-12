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
            // Send form to server if it's correct
            const f = new FormData(htmlForm);
            const ff = Object.fromEntries(f);
            console.log(JSON.stringify(ff))
            fetch('/add', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ff)
            })
                .then(response => {
                    return response.json();
                })
                .catch(err => {
                    console.error(err);
                });
        }
    });
}

function addTaskButtonHandler() {
    let add = document.querySelector('.task_content #task_operations #add_task');
    add.addEventListener('click', () => {
        addTaskForm();
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


async function menuHandler() {
    // Shading SVG elements and tbody on hover
    let images = document.querySelectorAll('img');
    for (let img of images) {
        mouseMovementHandler(img, '#849653');
    }

    addTaskButtonHandler();


}


menuHandler()

