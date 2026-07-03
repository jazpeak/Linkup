import React, { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { LANGUAGES } from '../constants/index.js';
import { CameraIcon, LoaderIcon, MapPinIcon } from 'lucide-react';

const ProfilePage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || '',
        bio: authUser?.bio || '',
        nativeLanguage: authUser?.nativeLanguage || '',
        learningLanguage: authUser?.learningLanguage || '',
        location: authUser?.location || '',
        profilePic: authUser?.profilePic || '',
    });

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post('/auth/onboarding', data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formState);
    };

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 1000) + 1;
        setFormState({ ...formState, profilePic: `https://api.dicebear.com/9.x/avataaars/svg?seed=${idx}` });
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl my-8">
            <div className="bg-base-200 rounded-xl shadow-lg p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                                <img src={formState.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=fallback`} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div onClick={handleRandomAvatar} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CameraIcon className="size-8 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-base-content/70 mt-2">Click image to generate new avatar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input type="text" value={formState.fullName} onChange={e => setFormState({ ...formState, fullName: e.target.value })} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Location</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPinIcon className="size-5 text-base-content/40" />
                                </div>
                                <input type="text" value={formState.location} onChange={e => setFormState({ ...formState, location: e.target.value })} className="input input-bordered w-full pl-10" placeholder="City, Country" required />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Native Language</span></label>
                            <select value={formState.nativeLanguage} onChange={e => setFormState({ ...formState, nativeLanguage: e.target.value })} className="select select-bordered" required>
                                <option value="" disabled>Select Language</option>
                                {LANGUAGES.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Learning Language</span></label>
                            <select value={formState.learningLanguage} onChange={e => setFormState({ ...formState, learningLanguage: e.target.value })} className="select select-bordered" required>
                                <option value="" disabled>Select Language</option>
                                {LANGUAGES.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Bio</span></label>
                        <textarea value={formState.bio} onChange={e => setFormState({ ...formState, bio: e.target.value })} className="textarea textarea-bordered h-24" placeholder="Tell us about yourself..." required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isPending}>
                        {isPending ? <LoaderIcon className="animate-spin" /> : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
