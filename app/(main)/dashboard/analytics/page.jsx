"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AnalyticsPage() {
  const [interviews, setInterviews] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchAnalyticsData(email);
    }
  }, []);

  const fetchAnalyticsData = async (email) => {
    try {
      setLoading(true);
      
      // Fetch interviews
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .select('*')
        .eq('companyEmail', email)
        .order('created_at', { ascending: false });

      if (interviewError) throw interviewError;

      // Fetch feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('companyEmail', email)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;

      setInterviews(interviewData || []);
      setFeedback(feedbackData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalInterviews = interviews.length;
    const completedInterviews = feedback.length;
    const completionRate = totalInterviews > 0 ? (completedInterviews / totalInterviews * 100) : 0;
    
    // Calculate average ratings
    const ratings = feedback.map(f => {
      try {
        const feedbackData = typeof f.feedback === 'string' ? JSON.parse(f.feedback) : f.feedback;
        const rating = feedbackData?.feedback?.rating;
        if (rating && typeof rating === 'object') {
          const values = Object.values(rating).filter(v => typeof v === 'number');
          return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        }
        return 0;
      } catch {
        return 0;
      }
    }).filter(r => r > 0);

    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    // Calculate success rate (ratings >= 7)
    const successfulInterviews = ratings.filter(r => r >= 7).length;
    const successRate = ratings.length > 0 ? (successfulInterviews / ratings.length * 100) : 0;

    return {
      totalInterviews,
      completedInterviews,
      completionRate,
      avgRating,
      successRate
    };
  };

  const getInterviewsByDate = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const interviewsOnDate = interviews.filter(interview => 
        interview.created_at?.split('T')[0] === dateStr
      ).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        interviews: interviewsOnDate
      });
    }
    
    return last7Days;
  };

  const getTopPositions = () => {
    const positionCounts = {};
    interviews.forEach(interview => {
      const position = interview.jobPosition || 'Unknown';
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });
    
    return Object.entries(positionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([position, count]) => ({ position, count }));
  };

  const metrics = calculateMetrics();
  const chartData = getInterviewsByDate();
  const topPositions = getTopPositions();

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your interview performance and insights</p>
          </div>
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your interview performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalyticsData(userEmail)}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalInterviews}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.completedInterviews}</p>
                <p className="text-sm text-green-600">
                  {metrics.completionRate.toFixed(1)}% completion rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.avgRating.toFixed(1)}/10
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.floor(metrics.avgRating / 2) ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.successRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Rating ≥ 7/10</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Interview Trends (Last 7 Days)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max((day.interviews / Math.max(...chartData.map(d => d.interviews))) * 100, 5)}%`
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {day.interviews}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Top Job Positions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPositions.length > 0 ? (
                topPositions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.position}</span>
                    </div>
                    <Badge variant="secondary">{item.count} interviews</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No interview data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Interview Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.slice(0, 5).map((interview, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Interview for {interview.jobPosition}
                  </p>
                  <p className="text-sm text-gray-600">
                    Candidate: {interview.userName} • {interview.userEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(interview.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge 
                  variant={feedback.some(f => f.candidateEmail === interview.userEmail) ? "default" : "secondary"}
                >
                  {feedback.some(f => f.candidateEmail === interview.userEmail) ? "Completed" : "Pending"}
                </Badge>
              </div>
            ))}
            {interviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
