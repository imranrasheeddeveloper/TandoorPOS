import apiClient from "./client2";

const endpoint = '/activityticket/ticket/scan';
const scanBarcode = (barcode, token) => {
   const data = new FormData();
   data.append('ticket_detail', barcode.hash);
   apiClient.setHeader('Authorization', 'Bearer '+token);
   return apiClient.post(endpoint, data);
}
export default {
    scanBarcode
}