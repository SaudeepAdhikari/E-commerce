import React, { useEffect, useState } from 'react';
import ProfileModern from './ProfileModern';
import ProfileAuth from './ProfileAuth';

const ProfileWrapper = ({ onLogin, onLogout, onRegister }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    if (isLoggedIn) {
        return <ProfileModern onLogout={onLogout} />;
    } else {
        return <ProfileAuth onLogin={onLogin} onLogout={onLogout} onRegister={onRegister} />;
    }
};

export default ProfileWrapper; 