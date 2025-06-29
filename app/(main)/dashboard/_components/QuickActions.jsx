import React from 'react';
import { Plus, Bot, BarChart3 } from 'lucide-react';

function QuickActions() {
    const actions = [
        {
            icon: Plus,
            title: 'Create Interview',
            description: 'Set up a new AI interview',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            icon: Bot,
            title: 'Manage Agents',
            description: 'Configure AI agents',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            icon: BarChart3,
            title: 'View Analytics',
            description: 'Interview insights',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {actions.map((action, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border shadow-sm transition-shadow cursor-pointer hover:shadow-md">
                    <div className="flex items-center space-x-3">
                        <div className={`p-3 ${action.bgColor} rounded-lg`}>
                            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuickActions; 