'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../provider';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Star,
  TrendingUp,
  MessageSquare,
  Brain,
  Briefcase,
  CheckCircle,
  XCircle,
  X,
  Download,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendationFilter, setRecommendationFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      fetchAllFeedbacks();
    }
  }, [user?.email]);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, recommendationFilter]);

  const fetchAllFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get all interviews by this company
      const { data: interviews, error: interviewError } = await supabase
        .from('Interviews')
        .select('interview_id')
        .eq('userEmail', user.email);

      if (interviewError) {
        console.error('Error fetching interviews:', interviewError);
        setError('Failed to fetch interviews');
        return;
      }

      if (!interviews || interviews.length === 0) {
        setFeedbacks([]);
        return;
      }

      const interviewIds = interviews.map(interview => interview.interview_id);

      // Then get all feedback for those interviews
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('interview-feedback')
        .select('*')
        .in('interview_id', interviewIds)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        setError('Failed to fetch feedback');
        toast.error('Failed to load feedback');
        return;
      }

      setFeedbacks(feedbackData || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feedback => 
        feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.interview_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Recommendation filter
    if (recommendationFilter !== 'all') {
      filtered = filtered.filter(feedback => {
        const recommendation = feedback.feedback?.feedback?.Recommendation?.toLowerCase();
        return recommendation === recommendationFilter || 
               (recommendationFilter === 'no' && recommendation === 'not recommended');
      });
    }

    setFilteredFeedbacks(filtered);
  };

  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  const getRecommendationBadge = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'yes':
      case 'recommended':
        return <Badge className="bg-green-100 text-green-800">Recommended</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
      case 'no':
      case 'not recommended':
        return <Badge className="bg-red-100 text-red-800">Not Recommended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'yes':
      case 'recommended':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maybe':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'no':
      case 'not recommended':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const calculateOverallScore = (ratings) => {
    if (!ratings) return 0;
    const scores = Object.values(ratings);
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadFeedback = (feedback) => {
    const feedbackText = `
Interview Feedback Report
========================

Candidate: ${feedback.userName || 'N/A'}
Email: ${feedback.userEmail || 'N/A'}
Interview ID: ${feedback.interview_id}
Date: ${formatDate(feedback.created_at)}

Ratings:
- Technical Skills: ${feedback.feedback?.feedback?.rating?.technicalSkills || 0}/10
- Communication: ${feedback.feedback?.feedback?.rating?.communication || 0}/10
- Problem Solving: ${feedback.feedback?.feedback?.rating?.problemSolving || 0}/10
- Experience: ${feedback.feedback?.feedback?.rating?.experience || 0}/10

Overall Score: ${calculateOverallScore(feedback.feedback?.feedback?.rating)}/10

Summary:
${feedback.feedback?.feedback?.summery || 'No summary available'}

Recommendation: ${feedback.feedback?.feedback?.Recommendation || 'N/A'}
${feedback.feedback?.feedback?.RecommendationMsg || ''}
    `;

    const blob = new Blob([feedbackText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${feedback.userName || 'candidate'}-${feedback.interview_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Feedback report downloaded!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading feedback...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span>{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 p-6 mb-6 rounded-lg">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
        </div>
        <p className="text-gray-600">
          Comprehensive analysis and insights from completed interviews
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by candidate name, email, or interview ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Recommendations</option>
              <option value="yes">Recommended</option>
              <option value="maybe">Maybe</option>
              <option value="no">Not Recommended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{feedbacks.length}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {feedbacks.filter(f => {
                  const rec = f.feedback?.feedback?.Recommendation?.toLowerCase();
                  return rec === 'yes' || rec === 'recommended';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Recommended</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {feedbacks.filter(f => f.feedback?.feedback?.Recommendation?.toLowerCase() === 'maybe').length}
              </div>
              <div className="text-sm text-gray-600">Maybe</div>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {feedbacks.filter(f => {
                  const rec = f.feedback?.feedback?.Recommendation?.toLowerCase();
                  return rec === 'no' || rec === 'not recommended';
                }).length}
              </div>
              <div className="text-sm text-gray-600">Not Recommended</div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feedbacks.length === 0 ? 'No feedback yet' : 'No feedback matches your search'}
            </h3>
            <p className="text-gray-600">
              {feedbacks.length === 0 
                ? 'Feedback will appear here when candidates complete interviews'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-gray-200 hover:border-blue-400">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(feedback.userName || 'A').charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feedback.userName || 'Anonymous Candidate'}
                      </h3>
                    </div>
                    {getRecommendationBadge(feedback.feedback?.feedback?.Recommendation)}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{feedback.userEmail || 'No email'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(feedback.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Overall: {calculateOverallScore(feedback.feedback?.feedback?.rating)}/10</span>
                    </div>
                  </div>

                  {feedback.feedback?.feedback?.summery && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Summary:</h5>
                      <p className="text-gray-700 text-sm line-clamp-3 bg-gray-50 p-3 rounded-lg">
                        {feedback.feedback.feedback.summery}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">ID: {feedback.interview_id.slice(0, 8)}...</span>
                    {feedback.feedback?.feedback?.rating && (
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          Tech: {feedback.feedback.feedback.rating.technicalSkills}/10
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Comm: {feedback.feedback.feedback.rating.communication}/10
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                          Problem: {feedback.feedback.feedback.rating.problemSolving}/10
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                          Exp: {feedback.feedback.feedback.rating.experience}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetailModal(feedback)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFeedback(feedback)}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredFeedbacks.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredFeedbacks.length} of {feedbacks.length} feedback entries
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Detailed Feedback</h3>
                <p className="text-gray-600">{selectedFeedback.userName} - {selectedFeedback.userEmail}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedFeedback(null);
                }}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Overall Result */}
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getRecommendationIcon(selectedFeedback.feedback?.feedback?.Recommendation)}
                  <div>
                    <h4 className="font-semibold text-lg">
                      {selectedFeedback.feedback?.feedback?.Recommendation === 'Yes' || selectedFeedback.feedback?.feedback?.Recommendation === 'Recommended' ? 'Recommended for Hire' : 
                       selectedFeedback.feedback?.feedback?.Recommendation === 'Maybe' ? 'Consider for Next Round' : 
                       'Not Recommended'}
                    </h4>
                    <p className="text-gray-600">
                      Overall Score: {calculateOverallScore(selectedFeedback.feedback?.feedback?.rating)}/10
                    </p>
                  </div>
                </div>
              </Card>

              {/* Ratings Breakdown */}
              {selectedFeedback.feedback?.feedback?.rating && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Performance Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center"><Brain className="w-4 h-4 mr-2" />Technical Skills</span>
                        <span className="font-semibold">{selectedFeedback.feedback.feedback.rating.technicalSkills}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(selectedFeedback.feedback.feedback.rating.technicalSkills || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-2" />Communication</span>
                        <span className="font-semibold">{selectedFeedback.feedback.feedback.rating.communication}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(selectedFeedback.feedback.feedback.rating.communication || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center"><Brain className="w-4 h-4 mr-2" />Problem Solving</span>
                        <span className="font-semibold">{selectedFeedback.feedback.feedback.rating.problemSolving}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(selectedFeedback.feedback.feedback.rating.problemSolving || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />Experience</span>
                        <span className="font-semibold">{selectedFeedback.feedback.feedback.rating.experience}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(selectedFeedback.feedback.feedback.rating.experience || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Summary */}
              {selectedFeedback.feedback?.feedback?.summery && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Interview Summary</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedFeedback.feedback.feedback.summery}
                  </p>
                </Card>
              )}

              {/* Recommendation Message */}
              {selectedFeedback.feedback?.feedback?.RecommendationMsg && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Recommendation Details</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedFeedback.feedback.feedback.RecommendationMsg}
                  </p>
                </Card>
              )}

              {/* Interview Info */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-semibold mb-3">Interview Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Interview ID:</span>
                    <p className="text-gray-600">{selectedFeedback.interview_id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Completed:</span>
                    <p className="text-gray-600">{formatDate(selectedFeedback.created_at)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Candidate:</span>
                    <p className="text-gray-600">{selectedFeedback.userName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-gray-600">{selectedFeedback.userEmail}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <Button
                variant="outline"
                onClick={() => downloadFeedback(selectedFeedback)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedFeedback(null);
                }}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage; 