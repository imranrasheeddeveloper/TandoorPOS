import apiClient from "./client";

const endpoint = '/activity/ticket/game/purchase';
const gamePurchase = (qr, activity_game_id  , token) => {
   const data = new FormData();
   data.append('qr', qr);
   data.append('activity_game_id', activity_game_id);
   data.append('activity_type', "game");
   apiClient.setHeader('Authorization', 'Bearer '+token);
   return apiClient.post(endpoint, data);
}
export default {
    gamePurchase
}