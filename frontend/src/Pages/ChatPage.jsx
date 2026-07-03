import React, {useEffect, useState} from 'react';
import {StreamChat} from 'stream-chat';
import {Chat, Channel, ChannelHeader, MessageComposer, MessageList, Thread, Window, ChannelList} from 'stream-chat-react';
import { useLocation } from 'react-router';
import 'stream-chat-react/dist/css/index.css';
import useAuthUser from '../hooks/useAuthUser.js';
import {axiosInstance} from '../lib/axios.js';

const ChatPage = () => {
    const {authUser} = useAuthUser();
    const location = useLocation();
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            const apiKey = import.meta.env.VITE_STREAM_API_KEY || 'default_key';
            const chatClient = StreamChat.getInstance(apiKey);

            try {
                const res = await axiosInstance.get('/chat/token');
                const token = res.data.token;

                await chatClient.connectUser(
                    {
                        id: authUser._id,
                        name: authUser.fullName,
                        image: authUser.profilePic,
                    },
                    token
                );

                setClient(chatClient);

                if (location.state?.createChatWith) {
                    const newChannel = chatClient.channel('messaging', {
                        members: [authUser._id, location.state.createChatWith]
                    });
                    await newChannel.watch();
                    setChannel(newChannel);
                }
            } catch (error) {
                console.error("Error connecting to chat", error);
            }
        };

        if (authUser) {
            initChat();
        }

        return () => {
            if (client) {
                client.disconnectUser();
            }
        };
    }, [authUser]);

    if (!client) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    const filters = {type: 'messaging', members: {$in: [authUser._id]}};
    const sort = {last_message_at: -1};

    return (
        <div className="flex h-full w-full">
            <Chat client={client} theme="messaging light">
                <div className="w-1/3 border-r border-base-300">
                    <ChannelList 
                        filters={filters} 
                        sort={sort} 
                        onChannelSelect={(chan) => setChannel(chan)}
                    />
                </div>
                <div className="w-2/3">
                    <Channel channel={channel}>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageComposer />
                        </Window>
                        <Thread />
                    </Channel>
                </div>
            </Chat>
        </div>
    );
};

export default ChatPage;
