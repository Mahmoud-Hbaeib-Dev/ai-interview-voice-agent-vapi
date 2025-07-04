'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser, redirectToJobiteLogin } from '../../lib/auth.js';
import DashboardProvider from './provider';
import { Toaster } from 'react-hot-toast';

function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                } else {
                    // Redirect to root page for authentication
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Authentication error:', error);
                // Redirect to root page for authentication
                window.location.href = '/';
            } finally {
                setLoading(false);
            }
        };

        validateAuth();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-blue-600 animate-spin border-t-transparent"></div>
                    <p className="text-gray-600">Validating access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center p-4 min-h-screen">
                <div className="mx-auto max-w-md text-center">
                    <div className="p-8 bg-white rounded-2xl shadow-xl">
                        <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h1>
                        <p className="mb-6 text-gray-600">
                            You need to be logged in to access the AI Interview System.
                        </p>
                        <button 
                            onClick={redirectToJobiteLogin}
                            className="px-4 py-2 w-full font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Go to Jobite Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DashboardProvider user={user}>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            {children}
        </DashboardProvider>
    );
}

export default DashboardLayout;
