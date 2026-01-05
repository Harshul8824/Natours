//update data

import { showAlerts } from "./alerts";
import axios from 'axios';

//type is either 'password' or 'data'
export const updateSttings = async (data, type) => {
    try {
        const url = type === 'password' ? "http://127.0.0.1:3000/api/v1/users/updatePassword" : "http://127.0.0.1:3000/api/v1/users/updateMe";
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlerts('success', `${type.toUpperCase()} updated successfully`);
        }
    } catch (err) {
        showAlerts('error', err.response.data.message);
    }
}