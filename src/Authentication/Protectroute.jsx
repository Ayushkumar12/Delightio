// src/Authentication/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authpro';

const Protectroute = ({ children }) => {
    const { currentUser  } = useAuth();

    if (!currentUser ) {
        return <Navigate to="/auth" />;
    }

    return children;
};

export default Protectroute;
