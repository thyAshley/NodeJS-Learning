import { login, logout } from './login';
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings'
const mapBox = document.getElementById('map');
const form = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const settingform = document.querySelector('.form-user-data');
const passwordform = document.querySelector('.form-user-settings')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    displayMap(locations);
}

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (settingform) {
    settingform.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const name = document.querySelector('#name').value;
        updateSettings({name: name, email: email}, 'data');
    })
}

if (passwordform) {
    passwordform.addEventListener('submit', async e => {
        e.preventDefault();
        const password = passwordform.querySelector('input[name="curPassword').value;
        const newPassword = passwordform.querySelector('input[name="newPassword').value;
        const passwordConfirm = passwordform.querySelector('input[name="cfmPassword').value;
        const saveBtn = document.querySelector('.btn--save-password');
        saveBtn.textContent = 'Updating...'
        await updateSettings({
            password,
            newPassword,
            passwordConfirm
        }, 'password').then(()=>{
            password.value = '';
            newPassword.value = '';
            passwordConfirm.value = '';
            saveBtn.textContent = 'Update password'
        })
    })
}