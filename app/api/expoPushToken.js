import apiClient from "./client2";
const endpoint = '/notification/token/store';

const storeToken = (notificationToken, token) => {
   const data = new FormData();
   data.append('notificationToken', notificationToken.data);

   apiClient.setHeader('Authorization', 'Bearer '+token);
   return apiClient.post(endpoint, data);
}
export default {
    storeToken
}