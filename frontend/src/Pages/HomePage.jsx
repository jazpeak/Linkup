import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { MessageCircleIcon } from 'lucide-react';

const HomePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: recommendations, isLoading: isRecLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users');
      return res.data;
    }
  });

  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/friends');
      return res.data;
    }
  });

  const { mutate: sendRequest, isPending: isSendingRequest } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.post(`/users/friend-request/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Recommended Language Partners</h2>
            <p className="text-base-content/70 mb-6">Based on your native and learning languages.</p>
            
            {isRecLoading ? (
              <div className="flex justify-center py-8"><span className="loading loading-spinner"></span></div>
            ) : recommendations?.length === 0 ? (
              <div className="text-center py-8 opacity-70">No recommendations found right now.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations?.map(user => (
                  <div key={user._id} className="bg-base-100 p-4 rounded-lg shadow flex items-start gap-4">
                    <img src={user.profilePic || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      <div className="text-xs space-y-1 mt-1">
                        <p><span className="font-medium text-primary">Native:</span> {user.nativeLanguage}</p>
                        <p><span className="font-medium text-secondary">Learning:</span> {user.learningLanguage}</p>
                        {user.location && <p><span className="font-medium">Location:</span> {user.location}</p>}
                      </div>
                      <button 
                        onClick={() => sendRequest(user._id)} 
                        disabled={isSendingRequest}
                        className="btn btn-primary btn-sm mt-3 w-full"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-base-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Your Friends</h2>
            
            {isFriendsLoading ? (
              <div className="flex justify-center py-4"><span className="loading loading-spinner"></span></div>
            ) : friends?.length === 0 ? (
              <div className="text-center py-4 opacity-70">You don't have any friends yet. Start connecting!</div>
            ) : (
              <div className="space-y-3">
                {friends?.map(friend => (
                  <div key={friend._id} className="bg-base-100 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <img src={friend.profilePic || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} alt={friend.fullName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium">{friend.fullName}</h4>
                      <p className="text-xs opacity-70">{friend.nativeLanguage} → {friend.learningLanguage}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/chat', { state: { createChatWith: friend._id } })}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <MessageCircleIcon className="size-5 text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
