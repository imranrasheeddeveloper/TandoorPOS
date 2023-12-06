import apiClient from "./client";

const endpoint = '/ticket/scan';
const scanBarcode = (barcode, token , type) => {
   const data = new FormData();
   console.log(barcode)
   data.append('qr_code', barcode);
   data.append('type', type);
   apiClient.setHeader('Authorization', 'Bearer '+token);
   return apiClient.post(endpoint, data);
}
export default {
    scanBarcode
}