function createCustomizeModal() {
    let modal = document.createElement('div');

    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = '#535353';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    return modal;
}


const newUserCreating = document.querySelector('#new_user');
newUserCreating.addEventListener('click', () => {
    /*
    Creates a form for registering a new user and displays it in a modal
    window when the button with the identifier new_user is clicked.
     */

    const customizeRegistrationForm = registerForm => {
        registerForm.style.width = '400px';
        registerForm.style.height = '400px';
        registerForm.style.backgroundColor = '#e1d6d6';
        registerForm.style.borderRadius = '20px';

        registerForm.method = 'post';
        registerForm.action = '/new_user';

    }
    const customizeFormButtons = (...args) => {
        args.forEach((arg) => {
                arg.style.width = '100px';
                arg.style.height = '20px';
                arg.style.display = 'flex';
                arg.style.flexDirection = 'row';
                arg.style.alignItems = 'center';
                arg.style.justifyContent = 'space-between';
                arg.style.padding = '14px';
                arg.style.margin = '10px';
            }
        )
    }

    // Creates form for new user registration and sets optimal style for its
    let form = document.createElement('form');
    customizeRegistrationForm(form);

    let fieldset = document.createElement('fieldset');
    for (let i = 0; i < 2; i++) {
        let inputField = document.createElement('input');
        let label = document.createElement('label');
        switch (i) {
            case 0:
                inputField.id = 'new_login';
                inputField.name = 'login';
                label.setAttribute('for', 'new_login');
                label.textContent = 'LOGIN';
                inputField.placeholder = 'Choose your name';
                break
            case 1:
                inputField.id = 'new_password';
                inputField.name = 'password';
                label.setAttribute('for', 'new_password');
                label.textContent = 'PASSWORD';
                inputField.placeholder = 'Put your password here';
        }
        fieldset.appendChild(label);
        fieldset.appendChild(inputField);
    }


    let modal = createCustomizeModal();
    let showModal = (modal) => {
        modal.style.display = 'flex';
    };
    let registerButton = document.createElement('button');
    let closeButton = document.createElement('button');
    registerButton.setAttribute('type', 'submit');
    registerButton.textContent = 'REGISTER';
    closeButton.textContent = 'CANCEL';
    closeButton.addEventListener('click', event => {
        event.preventDefault();
        modal.style.display = 'none';
    });
    customizeFormButtons(registerButton, closeButton)

    form.appendChild(registerButton);
    form.appendChild(closeButton);
    form.appendChild(fieldset);

    showModal(modal);
    modal.appendChild(form);
    document.body.appendChild(modal);

    // Add user in database if user does not exist. Create new user
    form.addEventListener('submit', event => {
        const fData = new FormData(form);
        const ffData = Object.fromEntries(fData)
        fetch('/new_user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ffData)
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err))
    })
})

// Check if the user valid. Otherwise, it redirects to 403
let login = document.querySelector('#auth')
login.addEventListener('submit', event => {
    const fData = new FormData(login);
    const ffData = Object.fromEntries(fData)
    fetch('/go', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ffData)
    }).catch(err => {
        console.error(err)
        alert('Failed attempt connect to database')
    })
})

// Shifting new_user button closer to a login button
let logBtn = document.getElementById('logBtn');
let new_user = document.getElementById('new_user');

let loginRect = logBtn.getBoundingClientRect();
let leftOffset = loginRect.left + loginRect.width + 20;

new_user.style.position = 'absolute';
new_user.style.left = leftOffset + 'px';
new_user.style.top = loginRect.top - 5 + 'px';
