import React from 'react';
import { Link } from 'react-router';
import { ShipWheelIcon, BellIcon, MessageCircleIcon, VideoIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.js';
import useAuthUser from '../hooks/useAuthUser.js';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post('/auth/logout');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success('Logged out successfully');
        }
    });

    return (
        <nav className="navbar bg-base-200 sticky top-0 z-50">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case text-xl gap-2">
                    <ShipWheelIcon className="size-6 text-primary" />
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Linkup
                    </span>
                </Link>
            </div>
            <div className="flex-none gap-2">
                <Link to="/chat" className="btn btn-ghost btn-circle">
                    <MessageCircleIcon className="size-5" />
                </Link>
                <Link to="/call" className="btn btn-ghost btn-circle">
                    <VideoIcon className="size-5" />
                </Link>
                <Link to="/notifications" className="btn btn-ghost btn-circle">
                    <BellIcon className="size-5" />
                </Link>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src={authUser?.profilePic || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} alt="Profile" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <Link to="/profile" className="justify-between">
                                {authUser?.fullName}
                                <span className="badge">Profile</span>
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => logout()}>
                                <LogOutIcon className="size-4 mr-2" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
