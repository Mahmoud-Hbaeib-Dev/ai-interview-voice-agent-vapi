import React from 'react';
import { Users, Bot, Calendar, CheckCircle, Loader2 } from 'lucide-react';

function StatsOverview({ stats, loading }) {
    const statsConfig = [
        {
            label: 'Total Interviews',
            value: stats?.totalInterviews || 0,
            icon: Users,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Interviews created'
        },
        {
            label: 'Active Agents',
            value: stats?.activeAgents || 0,
            icon: Bot,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'AI agents running'
        },
        {
            label: 'Scheduled',
            value: stats?.scheduled || 0,
            icon: Calendar,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            description: 'Awaiting candidates'
        },
        {
            label: 'Completed',
            value: stats?.completed || 0,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Interviews finished'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {statsConfig.map((stat, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsOverview; 