import { create } from 'apisauce'
//For Choices Digital wallet
const apiClient = create({
    baseURL: 'https://wallet.choevent.com/api'
});

export default apiClient;