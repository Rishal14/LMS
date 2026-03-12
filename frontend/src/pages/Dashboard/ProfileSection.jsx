import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, KeyRound, ShieldCheck } from 'lucide-react';

const ProfileSection = () => {
    const { user, updateProfile, deleteProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const res = await updateProfile(name, password || undefined);
        if (res.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword(''); // clear password field
        } else {
            setMessage({ type: 'error', text: res.message });
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you ABSOLUTELY sure? This action cannot be undone and will permanently delete your account and all associated data.")) {
            setLoading(true);
            const res = await deleteProfile();
            if (!res?.success) {
                setMessage({ type: 'error', text: res?.message || 'Deletion failed' });
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">My Profile</h2>
                        <p className="text-slate-500 font-medium">{user?.email}</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <ShieldCheck size={20} /> : null}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">Display Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">New Password (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <KeyRound size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                            />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 font-medium">Must be at least 8 characters with upper/lowercase, number, and special character.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-black/5 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="pt-8 mt-8 border-t border-red-100/50">
                        <h3 className="text-sm font-black text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-xs text-slate-500 font-medium mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className={`px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl shadow-sm border border-red-100 hover:bg-red-600 hover:text-white transition-all`}
                        >
                            Delete Account Permanently
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSection;
