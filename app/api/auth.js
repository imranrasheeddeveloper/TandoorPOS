import apiClient from "./client";
import * as Device from 'expo-device';
const login = (email, password) => {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('device_name', Device.designName);
    data.append('device_token', Device.osBuildId);
    data.append('device_id', Device.osInternalBuildId); 
    data.append('device', 'phone'); 
    return apiClient.post('/login', data).then(response => {
        return response;
     });
}


export default {
    login
};