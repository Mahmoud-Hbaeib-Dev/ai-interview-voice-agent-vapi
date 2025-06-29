import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '../../provider';
import { Building2, User } from 'lucide-react';

function WelcomeHeader() {
    const [imageError, setImageError] = useState(false);
    const user = useUser();

    // Generate company initials for avatar (same logic as CompanyInfo)
    const getCompanyInitials = (companyName) => {
        if (!companyName) return 'JB';
        return companyName
            .split(' ')
            .map(word => word?.[0] || '')
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'JB';
    };

    // Generate fallback avatar URL (same as CompanyInfo)
    const getFallbackAvatar = (companyName) => {
        const initials = getCompanyInitials(companyName);
        return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&bold=true&format=svg`;
    };

    const isEnterprise = user.role === 'ENTERPRISE';
    const companyName = user.entreprise?.nom || user.entreprise?.name; // Handle both 'nom' and 'name'
    const companyLogo = user.entreprise?.logo;
    const fallbackAvatarUrl = getFallbackAvatar(companyName);

    return (
        <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold">AI Interview Dashboard</h1>
                    <p className="text-blue-100">
                        Welcome back, {isEnterprise ? companyName : user.nom}!
                    </p>
                    <p className="mt-1 text-sm text-blue-200">
                        Manage your AI-powered interviews • {user.email}
                    </p>
                    {isEnterprise && user.entreprise?.sector && (
                        <p className="mt-1 text-xs text-blue-300">
                            {user.entreprise.sector} • Company ID: {user.entreprise.id}
                        </p>
                    )}
                </div>
                
                {/* Company/Profile Avatar - Enhanced Circular Design */}
                <div className="flex-shrink-0 ml-4">
                    {isEnterprise ? (
                        <div className="relative">
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 w-20 h-20 rounded-full blur-sm bg-white/20"></div>
                            {/* Main avatar container */}
                            <div className="overflow-hidden relative w-20 h-20 rounded-full border-4 shadow-2xl backdrop-blur-sm border-white/30 bg-white/10">
                                <img
                                    src={!imageError ? (companyLogo || fallbackAvatarUrl) : fallbackAvatarUrl}
                                    alt={`${companyName} logo`}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setImageError(true);
                                        e.target.src = fallbackAvatarUrl;
                                    }}
                                />
                            </div>
                            {/* Inner highlight */}
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full blur-md bg-white/30"></div>
                        </div>
                    ) : user?.logo ? (
                        <div className="relative">
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 w-20 h-20 rounded-full blur-sm bg-white/20"></div>
                            {/* Main avatar container */}
                            <div className="overflow-hidden relative w-20 h-20 rounded-full border-4 shadow-2xl border-white/30">
                                <Image 
                                    src={user.logo} 
                                    alt="Profile Avatar" 
                                    width={80} 
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            {/* Inner highlight */}
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full blur-md bg-white/30"></div>
                        </div>
                    ) : (
                        // Individual user fallback with enhanced styling
                        <div className="relative">
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 w-20 h-20 rounded-full blur-sm bg-white/20"></div>
                            {/* Main avatar container */}
                            <div className="flex relative justify-center items-center w-20 h-20 rounded-full border-4 shadow-2xl backdrop-blur-sm border-white/30 bg-white/10">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            {/* Inner highlight */}
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full blur-md bg-white/30"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Company Description (if available) */}
            {isEnterprise && user.entreprise?.description && (
                <div className="p-4 mt-6 rounded-xl border shadow-lg backdrop-blur-sm bg-white/10 border-white/20">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white/20">
                            <Building2 className="w-5 h-5 text-blue-200" />
                        </div>
                        <p className="text-sm leading-relaxed text-blue-100">
                            {user.entreprise.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WelcomeHeader; 