'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, redirectToJobiteLogin } from '../lib/auth.js';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                } else {
                    console.log('No valid authentication found');
                }
            } catch (error) {
                console.error('Authentication error:', error);
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
        <div className="p-4 min-h-screen">
            <div className="mx-auto max-w-6xl">
                <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-900">AI Interview Dashboard</h1>
                    <p className="mt-1 text-gray-600">
                        Welcome back, {user.role === 'ENTERPRISE' ? user.entreprise?.nom : user.nom}!
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Logged in as: {user.email}</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">🎉 Authentication Successful!</h3>
                    <p className="text-gray-600">
                        Great! Your authentication system is working. You can now
                        continue building the AI interview features.
                    </p>
                </div>
            </div>
        </div>
    );
} 