import React from 'react';
import { Clock, Calendar, CheckCircle, User, Loader2, MessageSquare, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function RecentActivity({ interviews, feedback, loading }) {
    // Combine and sort activities
    const getRecentActivities = () => {
        const activities = [];
        
        // Add interview creation activities
        interviews?.forEach(interview => {
            activities.push({
                id: `interview-${interview.id}`,
                type: 'interview_created',
                title: `Interview Created: ${interview.jobPosition}`,
                description: `New interview for ${interview.jobPosition} position`,
                timestamp: interview.created_at,
                icon: Calendar,
                iconColor: 'text-blue-600',
                bgColor: 'bg-blue-50'
            });
        });

        // Add feedback activities
        feedback?.forEach(fb => {
            activities.push({
                id: `feedback-${fb.id}`,
                type: 'interview_completed',
                title: `Interview Completed by ${fb.userName}`,
                description: `Feedback received from ${fb.userName}`,
                timestamp: fb.created_at,
                icon: CheckCircle,
                iconColor: 'text-green-600',
                bgColor: 'bg-green-50',
                recommendation: fb.feedback?.feedback?.Recommendation
            });
        });

        // Sort by timestamp (newest first)
        return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    };

    const activities = getRecentActivities();

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return time.toLocaleDateString();
    };

    const getRecommendationBadge = (recommendation) => {
        switch (recommendation?.toLowerCase()) {
            case 'yes':
            case 'recommended':
                return <Badge className="bg-green-100 text-green-800 text-xs">Recommended</Badge>;
            case 'maybe':
                return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Maybe</Badge>;
            case 'no':
            case 'not recommended':
                return <Badge className="bg-red-100 text-red-800 text-xs">Not Recommended</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                        <span className="text-sm text-gray-500">{activities.length} activities</span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="py-8 text-center">
                        <Clock className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                        <p className="text-gray-600">No recent activity yet</p>
                        <p className="mt-1 text-sm text-gray-500">Start by creating your first AI interview</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                                    <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {activity.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                    {activity.recommendation && (
                                        <div className="flex items-center gap-2">
                                            {getRecommendationBadge(activity.recommendation)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecentActivity; 