import apiClient from "./client2";
const endpoint = '/transaction/purchase';

const purchaseTicket = (ticket, user_id, token) => {
    //Request keys = sender_id, amount, model, model_id, receiver_id
   const data = new FormData();
   data.append('sender_id', user_id);
   data.append('amount', ticket.price);
   data.append('model', 'EventActivityTicket');
   data.append('model_id', ticket.id);
   data.append('receiver_id', ticket.organizer_id);
   data.append('activity_name', ticket.activity_name);
   data.append('activity_type_name', ticket.activity_type_name);
   apiClient.setHeader('Authorization', 'Bearer '+token);
   return apiClient.post(endpoint, data);
}
export default {
    purchaseTicket
}