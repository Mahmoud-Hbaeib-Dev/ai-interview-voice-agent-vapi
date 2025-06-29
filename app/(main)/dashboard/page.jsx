'use client';

import React from 'react';
import WelcomeHeader from './_components/WelcomeHeader';
import QuickActions from './_components/QuickActions';
import StatsOverview from './_components/StatsOverview';
import RecentActivity from './_components/RecentActivity';
import SuccessMessage from './_components/SuccessMessage';

function Dashboard() {
    return (
        <div className="space-y-6">
            <WelcomeHeader />
            <QuickActions />
            <StatsOverview />
            <RecentActivity />
            <SuccessMessage />
        </div>
    );
}

export default Dashboard;
