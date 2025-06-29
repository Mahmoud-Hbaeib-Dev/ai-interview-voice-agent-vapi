import React from 'react';
import { Clock } from 'lucide-react';

function RecentActivity() {
    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
                <div className="py-8 text-center">
                    <Clock className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                    <p className="text-gray-600">No recent activity yet</p>
                    <p className="mt-1 text-sm text-gray-500">Start by creating your first AI interview</p>
                </div>
            </div>
        </div>
    );
}

export default RecentActivity; 