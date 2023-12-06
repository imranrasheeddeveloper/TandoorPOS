import apiClient from "./client2";

const endpoint = '/activityticket/get-eventWithActivityTickets';

const getEventWithActivityTickets = token => {
    apiClient.setHeader('Authorization', 'Bearer '+token);
    return apiClient.get(endpoint);
 }
export default {
    getEventWithActivityTickets
}