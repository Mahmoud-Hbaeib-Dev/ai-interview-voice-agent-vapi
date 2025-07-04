'use client';



import React, { useState, useEffect } from 'react';
import { useUser } from '../provider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import WelcomeHeader from './_components/WelcomeHeader';
import QuickActions from './_components/QuickActions';
import StatsOverview from './_components/StatsOverview';
import RecentActivity from './_components/RecentActivity';
import SuccessMessage from './_components/SuccessMessage';


function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        interviews: [],
        feedback: [],
        stats: {
            totalInterviews: 0,
            activeAgents: 0,
            scheduled: 0,
            completed: 0
        },
        loading: true
    });
    
    const user = useUser();

    useEffect(() => {
        if (user?.email) {
            fetchDashboardData();
        }
    }, [user?.email]);

    const fetchDashboardData = async () => {
        try {
            setDashboardData(prev => ({ ...prev, loading: true }));

            // Fetch interviews created by this company
            const { data: interviews, error: interviewError } = await supabase
                .from('Interviews')
                .select('*')
                .eq('userEmail', user.email)
                .order('created_at', { ascending: false });

            if (interviewError) {
                console.error('Error fetching interviews:', interviewError);
                toast.error('Failed to fetch interviews');
                return;
            }

            // Fetch feedback for company's interviews
            const interviewIds = interviews?.map(interview => interview.interview_id) || [];
            let feedback = [];
            
            if (interviewIds.length > 0) {
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('interview-feedback')
                    .select('*')
                    .in('interview_id', interviewIds)
                    .order('created_at', { ascending: false });

                if (feedbackError) {
                    console.error('Error fetching feedback:', feedbackError);
                } else {
                    feedback = feedbackData || [];
                }
            }

            // Calculate stats
            const totalInterviews = interviews?.length || 0;
            const completedInterviews = feedback?.length || 0;
            const scheduledInterviews = totalInterviews - completedInterviews;
            const activeAgents = totalInterviews > 0 ? 1 : 0; // Simplified: 1 if any interviews exist

            setDashboardData({
                interviews: interviews || [],
                feedback: feedback || [],
                stats: {
                    totalInterviews,
                    activeAgents,
                    scheduled: scheduledInterviews,
                    completed: completedInterviews
                },
                loading: false
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
            setDashboardData(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className="space-y-6">
            <WelcomeHeader />
            <QuickActions />
            <StatsOverview 
                stats={dashboardData.stats} 
                loading={dashboardData.loading} 
            />
            <RecentActivity 
                interviews={dashboardData.interviews}
                feedback={dashboardData.feedback}
                loading={dashboardData.loading}
            />
            <SuccessMessage />
        </div>
    );
}

export default Dashboard;
