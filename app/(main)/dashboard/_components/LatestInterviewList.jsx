'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../provider';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Briefcase,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function LatestInterviewList({ interviews: propsInterviews, loading: propsLoading }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const user = useUser();
  const router = useRouter();

  // Use props data if available, otherwise fetch own data
  useEffect(() => {
    if (propsInterviews && propsLoading !== undefined) {
      setInterviews(propsInterviews.slice(0, 10)); // Show latest 10 interviews
      setLoading(propsLoading);
      setError(null);
    } else if (user?.email) {
      fetchCompanyInterviews();
    }
  }, [propsInterviews, propsLoading, user?.email]);

  const fetchCompanyInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch interviews created by this company
      const { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('userEmail', user.email)
        .order('created_at', { ascending: false })
        .limit(10); // Show latest 10 interviews

      if (error) {
        console.error('Error fetching interviews:', error);
        setError('Failed to fetch interviews');
        toast.error('Failed to load interviews');
        return;
      }

      setInterviews(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('Interviews')
        .delete()
        .eq('interview_id', interviewId)
        .eq('userEmail', user.email); // Ensure company can only delete their own interviews

      if (error) {
        console.error('Error deleting interview:', error);
        toast.error('Failed to delete interview');
        return;
      }

      // Remove from local state
      setInterviews(prev => prev.filter(interview => interview.interview_id !== interviewId));
      toast.success('Interview deleted successfully');
    } catch (err) {
      console.error('Error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const openQuestionsModal = (interview) => {
    setSelectedInterview(interview);
    setShowQuestionsModal(true);
  };

  const getStatusBadge = (interview) => {
    // You can customize this based on your interview status logic
    const now = new Date();
    const createdAt = new Date(interview.created_at);
    const daysSinceCreated = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    if (daysSinceCreated < 1) {
      return <Badge className="bg-green-100 text-green-800">New</Badge>;
    } else if (daysSinceCreated < 7) {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Older</Badge>;
    }
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading interviews...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Latest Interviews</h2>
          <p className="text-gray-600">
            Manage interviews created by {user?.entreprise?.nom || user?.entreprise?.name}
          </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/create-interview')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Interview
        </Button>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first AI-powered interview to get started
          </p>
          <Button 
            onClick={() => router.push('/dashboard/create-interview')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Interview
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.interview_id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.jobPosition || 'Untitled Interview'}
                    </h3>
                    {getStatusBadge(interview)}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(interview.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{interview.duration || '15 minutes'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{interview.type || 'AI Interview'}</span>
                    </div>
                  </div>

                  {interview.jobDescription && (
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {interview.jobDescription}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Interview ID: {interview.interview_id}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/interview/${interview.interview_id}`, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openQuestionsModal(interview)}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Questions</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/create-interview?edit=${interview.interview_id}`)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteInterview(interview.interview_id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {interviews.length > 0 && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/interviews')}
          >
            View All Interviews
          </Button>
        </div>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && selectedInterview && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Interview Questions</h3>
                <p className="text-gray-600">{selectedInterview.jobPosition}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowQuestionsModal(false);
                  setSelectedInterview(null);
                }}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {selectedInterview.questionList && selectedInterview.questionList.length > 0 ? (
                selectedInterview.questionList.map((questionItem, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {typeof questionItem === 'string' ? questionItem : questionItem.question}
                        </p>
                        {typeof questionItem === 'object' && questionItem.type && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {questionItem.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Questions Available</h4>
                  <p className="text-gray-600">This interview doesn't have any questions yet.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuestionsModal(false);
                  setSelectedInterview(null);
                }}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}

export default LatestInterviewList;
