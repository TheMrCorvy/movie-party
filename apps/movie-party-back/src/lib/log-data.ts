import "@salvatore.hakase/log-data";

declare module "@salvatore.hakase/log-data" {
    export interface LayersAvailable {
        strapi_service: "strapi_service";
        messages: "messages";
        room_ws: "room_ws";
        participants_update: "participants_update";
        camera: "camera";
        camera_caller: "camera_caller";
        camera_receiver: "camera_receiver";
        screen_sharing: "screen_sharing";
        screen_sharing_sender: "screen_sharing_sender";
        screen_sharing_receiver: "screen_sharing_receiver";
        access_user_hardware: "access_user_hardware";
        poll: "poll";
    }
}
