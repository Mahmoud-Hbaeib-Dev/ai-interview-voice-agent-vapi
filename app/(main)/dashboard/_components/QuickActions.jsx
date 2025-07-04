import React from 'react';
import { Plus, Bot, BarChart3, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

function QuickActions() {
    const router = useRouter();
    
    const actions = [
        {
            icon: Plus,
            title: 'Create Interview',
            description: 'Set up a new AI interview',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            hoverColor: 'hover:bg-blue-50',
            onClick: () => router.push('/dashboard/create-interview')
        },
        {
            icon: Bot,
            title: 'Manage Interviews',
            description: 'View and manage interviews',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            hoverColor: 'hover:bg-green-50',
            onClick: () => router.push('/dashboard/interviews')
        },
        {
            icon: BarChart3,
            title: 'View Feedback',
            description: 'Interview insights & analytics',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            hoverColor: 'hover:bg-purple-50',
            onClick: () => router.push('/dashboard/feedback')
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {actions.map((action, index) => (
                <div 
                    key={index} 
                    onClick={action.onClick}
                    className={`p-6 bg-white rounded-xl border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 ${action.hoverColor} group`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 ${action.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuickActions; 