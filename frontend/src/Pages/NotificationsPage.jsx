import React from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import {CheckIcon, XIcon} from 'lucide-react';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/friend-request/');
      return res.data;
    }
  });

  const {mutate: acceptRequest, isPending} = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Friend request accepted');
      queryClient.invalidateQueries({queryKey: ['notifications']});
      queryClient.invalidateQueries({queryKey: ['friends']});
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="bg-base-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Incoming Friend Requests</h2>
        
        {(!data?.incomingReqs || data.incomingReqs.length === 0) ? (
          <div className="text-center py-8 opacity-70">No pending friend requests.</div>
        ) : (
          <div className="space-y-4">
            {data.incomingReqs.map(req => (
              <div key={req._id} className="bg-base-100 p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={req.sender.profilePic || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} 
                    alt={req.sender.fullName} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <h3 className="font-semibold">{req.sender.fullName}</h3>
                    <p className="text-xs opacity-70">{req.sender.nativeLanguage} → {req.sender.learningLanguage}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => acceptRequest(req._id)}
                    disabled={isPending}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckIcon className="size-4" />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
