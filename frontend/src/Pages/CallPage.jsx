import React, {useEffect, useState} from 'react';
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    SpeakerLayout,
    CallControls,
    StreamTheme,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import useAuthUser from '../hooks/useAuthUser.js';
import {axiosInstance} from '../lib/axios.js';

const CallPage = () => {
    const {authUser} = useAuthUser();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [callId, setCallId] = useState('');

    useEffect(() => {
        const initVideo = async () => {
            const apiKey = import.meta.env.VITE_STREAM_API_KEY || 'default_key';

            try {
                const res = await axiosInstance.get('/chat/token');
                const token = res.data.token;

                const videoClient = new StreamVideoClient({
                    apiKey,
                    user: {
                        id: authUser._id,
                        name: authUser.fullName,
                        image: authUser.profilePic,
                    },
                    token
                });

                setClient(videoClient);
            } catch (error) {
                console.error("Error connecting to video client", error);
            }
        };

        if (authUser) {
            initVideo();
        }

        return () => {
            if (client) {
                client.disconnectUser();
            }
        };
    }, [authUser]);

    const joinCall = async () => {
        if (!client || !callId) return;
        const newCall = client.call('default', callId);
        await newCall.join({create: true});
        setCall(newCall);
    };

    if (!client) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="flex flex-col h-full w-full p-4">
            {!call ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <h2 className="text-2xl font-bold">Start a Video Call</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="input input-bordered" 
                            placeholder="Enter Call ID"
                            value={callId}
                            onChange={(e) => setCallId(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={joinCall}>Join / Create</button>
                    </div>
                </div>
            ) : (
                <StreamVideo client={client}>
                    <StreamTheme>
                        <StreamCall call={call}>
                            <div className="flex flex-col h-[calc(100vh-80px)] w-full rounded-xl overflow-hidden bg-base-300">
                                <SpeakerLayout />
                                <CallControls onLeave={() => setCall(null)} />
                            </div>
                        </StreamCall>
                    </StreamTheme>
                </StreamVideo>
            )}
        </div>
    );
};

export default CallPage;
