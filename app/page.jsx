'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, redirectToJobiteLogin } from '../lib/auth.js';
import { upsertUser } from '../lib/user-service';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    console.log('User authenticated:', userData);
                    
                    // Try to store user data, but continue even if it fails
                    try {
                        await upsertUser(userData);
                    } catch (storageError) {
                        console.warn('Failed to store user data:', storageError);
                        // Continue anyway since the user is authenticated
                    }
                    
                    // User is authenticated, redirect to dashboard
                    router.push('/dashboard');
                } else {
                    console.log('No valid authentication found');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setError(error.message || 'Authentication failed');
                setLoading(false);
            }
        };

        validateAuth();
    }, [router]);

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

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="mx-auto max-w-md text-center">
                    <div className="p-8 bg-white rounded-2xl shadow-xl">
                        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
                        <p className="mb-6 text-gray-600">{error}</p>
                        <button 
                            onClick={redirectToJobiteLogin}
                            className="px-4 py-2 w-full font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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