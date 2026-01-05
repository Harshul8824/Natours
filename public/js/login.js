import axios from 'axios';
import { showAlerts } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        })

        if (res.data.status == 'success') {
            showAlerts('success', 'loggedIn successfully')
            setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    }
    catch (err) {
        showAlerts('error', err.response.data.message);
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
       console.log(res.data.status);
        if ((res.data.status === 'success')) location.reload(true);
    } catch (err) {
        showAlerts('error', 'Error logged Out! try again');
    }
}