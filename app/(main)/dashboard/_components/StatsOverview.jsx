import React from 'react';
import { Users, Bot, Calendar, CheckCircle } from 'lucide-react';

function StatsOverview() {
    const stats = [
        {
            label: 'Total Interviews',
            value: '0',
            icon: Users,
            iconColor: 'text-blue-600'
        },
        {
            label: 'Active Agents',
            value: '0',
            icon: Bot,
            iconColor: 'text-green-600'
        },
        {
            label: 'Scheduled',
            value: '0',
            icon: Calendar,
            iconColor: 'text-orange-600'
        },
        {
            label: 'Completed',
            value: '0',
            icon: CheckCircle,
            iconColor: 'text-green-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsOverview; 