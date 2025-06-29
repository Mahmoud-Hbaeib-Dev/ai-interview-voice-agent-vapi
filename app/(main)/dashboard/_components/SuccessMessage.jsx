'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

function SuccessMessage() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-hide after 6 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 10000);

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="p-6 bg-green-50 rounded-xl border border-green-200 duration-500 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-green-900">🎉 Authentication Successful!</h3>
                        <p className="mt-1 text-green-700">
                            Your AI Interview System is now connected to your Jobite account. 
                            You can now create AI agents and manage interviews.
                        </p>
                        <p className="mt-2 text-sm text-green-600">
                            Next steps: Follow the tutorial to create your first AI interview agent!
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-1 text-green-600 rounded-full transition-colors hover:text-green-800 hover:bg-green-100"
                    aria-label="Close message"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            {/* Progress bar showing auto-hide countdown */}
            <div className="overflow-hidden mt-4 h-1 bg-green-200 rounded-full">
                <div 
                    className="h-full bg-green-500 rounded-full animate-progress-bar"
                    style={{
                        animation: 'shrink 10s linear forwards'
                    }}
                />
            </div>
            
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

export default SuccessMessage; 