import apiClient from "./client";

const endpoint = '/activity/ticket/get/assigned/activity';

const getAssignedActivity = token => {
    apiClient.setHeader('Authorization', 'Bearer '+token);
    return apiClient.get(endpoint);
 }
export default {
    getAssignedActivity
}