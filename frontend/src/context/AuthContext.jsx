import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const verifyEmail = async (email, code) => {
        try {
            const { data } = await api.post('/auth/verify-email', { email, code });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verification failed. Please check the code.'
            };
        }
    };

    const logout = async () => {
        if (user?.sessionId) {
            try {
                await api.post('/auth/logout', { sessionId: user.sessionId });
            } catch (err) {
                console.error('Logout tracking failed', err);
            }
        }
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async (name, password) => {
        try {
            const { data } = await api.put('/users/profile', { name, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const deleteProfile = async () => {
        try {
            await api.delete('/users/profile');
            logout(); // Log them out immediately
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile deletion failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmail, logout, updateProfile, deleteProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
