import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || ! apiSecret )
    console.error("Stream API Key or Secrect is Missing");

const streamClient = StreamChat.getInstance(apiKey,apiSecret);


export const upsertStreamUser = async (userData)=> {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error Upserting User data to Stream:",error);
    }
}


export const generateStreamToken = (userId)=>{
    try {
        //Make sure the userId is String
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error Generating StreamToken",error);
    }
}