import axios from 'axios';
import { showAlerts } from './alerts';

export const forgotPassword = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/forgetPassword',
            data: { email }
        });
        if (res.data.status === 'success') {
            showAlerts('success', 'Token sent to email! Check your inbox.');
        }
    } catch (err) {
        showAlerts('error', err.response.data.message);
    }
};

export const resetPassword = async (token, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${token}`,
            data: { password, passwordConfirm }
        });
        if (res.data.status === 'success') {
            showAlerts('success', 'Password reset successful!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlerts('error', err.response.data.message);
    }
};

export const deleteAccount = async () => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/users/deleteMe'
        });
        if (res.status === 204) {
            showAlerts('success', 'Account deleted successfully.');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlerts('error', err.response ? err.response.data.message : 'Error deleting account');
    }
};

export const addReview = async (tourId, review, rating) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/tours/${tourId}/reviews`,
            data: { review, rating }
        });
        if (res.data.status === 'success') {
            showAlerts('success', 'Review added successfully!');
            window.setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (err) {
        showAlerts('error', err.response.data.message || 'Error adding review');
    }
};
