import {StreamChat} from "stream-chat"
import "dotenv/config"

const apikey=process.env.STREAM_API_KEY;
const apisecret=process.env.STREAM_API_SECRET;

if(!apikey||!apisecret){
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apikey,apisecret);

export const upsertStreamUser = async (userData)=> {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream User");
    }
}

export const generateStreamToken =  (userId)=> {
    try {
        //ensure userid is string
        const userIdStr=userId.toString();
        return streamClient.createToken(userIdStr);
    }catch(error){
        console.error("Error creating StreamToken",error);
    }
}