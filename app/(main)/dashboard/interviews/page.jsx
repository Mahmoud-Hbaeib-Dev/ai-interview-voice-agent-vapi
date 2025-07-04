'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../provider';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Copy,
  Mail,
  X,
  Send,
  FileText,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      fetchAllInterviews();
    }
  }, [user?.email]);

  useEffect(() => {
    const loadCompanyData = async () => {
      const userData = await getCurrentUser();
      setCompanyData(userData);
    };
    loadCompanyData();
  }, []);

  const fetchAllInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('userEmail', user.email)
        .order('created_at', { ascending: false });

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

  const copyInterviewLink = (interviewId) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    navigator.clipboard.writeText(link);
    toast.success('Interview link copied to clipboard!');
  };

  const openEmailModal = (interview) => {
    setSelectedInterview(interview);
    setShowEmailModal(true);
  };

  const openQuestionsModal = (interview) => {
    setSelectedInterview(interview);
    setShowQuestionsModal(true);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setIsSending(true);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const interviewLink = `${window.location.origin}/interview/${selectedInterview.interview_id}`;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `Interview Invitation for ${selectedInterview.jobPosition} Position`,
          position: selectedInterview.jobPosition,
          duration: selectedInterview.duration,
          questions: selectedInterview.questionList?.length || 10,
          expirationDate: expirationDate.toLocaleDateString(),
          interviewLink: interviewLink,
          companyName: companyData?.entreprise?.nom,
          companyEmail: companyData?.email,
          companyLogo: companyData?.entreprise?.logo
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} ${errorText || response.statusText}`);
      }

      const data = await response.json();

      toast.success('Email sent successfully!', {
        description: `Invitation sent to ${recipientEmail}`,
      });
      setShowEmailModal(false);
      setRecipientEmail('');
      setSelectedInterview(null);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email', {
        description: error.message || 'Please try again or copy the link manually',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (interview) => {
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
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading interviews...</span>
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
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">All Interviews</h1>
        <p className="text-gray-600">
          View all interviews created by {user?.entreprise?.nom || user?.entreprise?.name || 'your company'}
        </p>
      </div>

      {/* Stats */}
      <Card className="p-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{interviews.length}</div>
          <div className="text-gray-600">Total Interviews Created</div>
        </div>
      </Card>

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-600">No interviews have been created yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.interview_id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {interview.jobPosition || 'Untitled Interview'}
                    </h3>
                    {getStatusBadge(interview)}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
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
                    <p className="text-gray-700 text-sm mb-4">
                      {interview.jobDescription}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Interview ID: {interview.interview_id}</span>
                    <span>Questions: {interview.questionList?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInterviewLink(interview.interview_id)}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
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
                    onClick={() => openEmailModal(interview)}
                    className="flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results count */}
      {interviews.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Total: {interviews.length} interviews
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedInterview && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Send Interview Invitation</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEmailModal(false);
                  setSelectedInterview(null);
                  setRecipientEmail('');
                }}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="p-4 space-y-2 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium">Email Preview</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Position:</strong> {selectedInterview.jobPosition}</p>
                  <p><strong>Duration:</strong> {selectedInterview.duration}</p>
                  <p><strong>Questions:</strong> {selectedInterview.questionList?.length || 10}</p>
                  <p><strong>Expires:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedInterview(null);
                    setRecipientEmail('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
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
    </div>
  );
}

export default InterviewsPage; 