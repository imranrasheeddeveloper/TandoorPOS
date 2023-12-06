import apiClient from "./client";

const verifyTicket = (ticketDetails, token) => {
    apiClient.setHeader('Authorization', 'Bearer '+token);
    return apiClient.get("/users/"+ticketDetails.user_id+"/events/"+ticketDetails.user_id+"/tickets/"+ticketDetails.ticket_id+"/subTicket/"+ticketDetails.sub_ticket_id+"/verify");
 }
export default {
    verifyTicket
}