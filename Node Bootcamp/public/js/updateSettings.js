import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
    const url = type === password ? 'updatePassword' : 'updateMe';
    if (type === 'data'){
        try {
            const res = await axios.patch(`http://localhost:3000/api/v1/users/updateMe`, {
                name: data.name,
                email: data.email
            });
            if (res.data.status === 'success') {
                showAlert('success', `${type.toUpperCase()} Update Successful`);
                window.setTimeout(()=>{
                    location.reload(true)
                }, 1000);
            }
        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    }
    if (type === 'password') {
        try {
            const res = await axios.patch(`http://localhost:3000/api/v1/users/updatePassword`, {
                password: data.password,
                newPassword: data.newPassword,
                passwordConfirm: data.passwordConfirm

            });
            if (res.data.status === 'success') {
                showAlert('success', `${type.toUpperCase()} Update Successful`);
                window.setTimeout(()=>{
                    location.reload(true)
                }, 1000);
            }
        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    }
    
}
