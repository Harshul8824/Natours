import { login, logout, signup } from './login';
import '@babel/polyfill';
import { dispplayMap } from './leafletMap';
import { updateSttings } from './updateSettings';
import { bookTour } from './razorpay'

//LOGIN
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const mapBox = document.getElementById('map');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    // console.log('Locations:', locations);
    dispplayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); //It prevents actions like page reload on form submit, link redirection, or other browser default actions.
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // console.log(email, password);

        login(email, password);
    })
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        signup(name, email, password, passwordConfirm);
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('email', document.getElementById('email').value);
        form.append('name', document.getElementById('name').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);
        updateSttings(form, 'data');
    })
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...'
        const oldPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const newPasswordConfirm = document.getElementById('password-confirm').value;
        await updateSttings({oldPassword, newPassword, newPasswordConfirm}, 'password');
    
        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing....'
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    })
}
